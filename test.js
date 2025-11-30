// test.js

// 0) 디버그용 전역 에러 핸들러
process.on("uncaughtException", (err) => {
    console.error("🔥 uncaughtException:", err);
});

process.on("unhandledRejection", (reason, p) => {
    console.error("🔥 unhandledRejection:", reason);
});

// 1) 여기에 너의 실제 Gemini API 키를 그대로 적어줘.
const GEMINI_API_KEY = "YOUR_KEY";

// **로컬 테스트에서는 아예 체크만 간단히**
if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY가 비어 있습니다.");
    process.exit(1);
}

// 2) 태그 리스트 (App Script와 동일)
const ALL_TAGS = [
    "뉴스", "교육", "코미디", "일상", "게임", "음악", "영화", "스포츠", "패션", "뷰티", "기술", "음식", "여행", "건강", "과학", "역사",
    "정치", "경제", "재테크", "자기계발", "예술", "반려동물", "환경", "리뷰", "공예", "취미", "오디오", "팟캐스트", "만화", "아동", "종교",
    "문화", "쇼핑", "부동산", "법률", "의학", "IT", "문학", "시사", "조리", "힐링", "ASMR"
];

// 3) HTML 가져오기
async function fetchHtmlSnippet(targetUrl) {
    console.log("🔎 HTML 가져오는 중:", targetUrl);
    try {
        const res = await fetch(targetUrl, {
            redirect: "follow",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
            }
        });
        console.log("   ↳ HTTP status:", res.status, res.statusText);
        if (!res.ok) {
            throw new Error(`HTML fetch HTTP ${res.status} ${res.statusText}`);
        }
        const text = await res.text();
        console.log("   ↳ HTML 길이:", text.length);
        return text.slice(0, 10000);  // 앞 10000자만 사용
    } catch (e) {
        console.error("⚠️ HTML 가져오기 실패:", e.message);
        return "";
    }
}

// 4) 프롬프트 생성
function buildPrompt(htmlSnippet, url, userTopic = "자동 감지") {
    const userTopicHint =
        userTopic && userTopic !== "자동 감지" ? userTopic : "";

    return [
        "다음은 어떤 웹 페이지의 HTML 일부입니다.",
        "이 내용을 바탕으로 아래 세 가지를 JSON 형식으로 출력해주세요.",
        "",
        "1) title: 한국어로 된 제목 (너무 길지 않게, 핵심 주제만 담아주세요)",
        "2) summary: 한국어로 50~100자 정도의 요약 (한 단락, 문장 여러 개 가능)",
        "3) tags: 아래 카테고리 목록 중에서 이 페이지와 가장 관련이 높은 주제 1~3개 (문자열 배열)",
        "",
        "카테고리 목록:",
        ALL_TAGS.join(", "),
        "",
        userTopicHint
            ? `사용자가 선택한 초기 카테고리 힌트: "${userTopicHint}"\n이 힌트와 실제 내용을 함께 고려해서 태그를 골라주세요.\n`
            : "",
        "반드시 다음 형식의 JSON만 출력하세요. 추가 설명 문장은 금지합니다.",
        "",
        "{",
        '  "title": "제목",',
        '  "summary": "요약",',
        '  "tags": ["카테고리1", "카테고리2"]',
        "}",
        "",
        "HTML 일부:",
        htmlSnippet ||
        "(내용을 가져오지 못했습니다. URL과 추측만으로 대략적인 제목/요약/태그를 생성해주세요: " +
        url +
        ")",
    ].join("\n");
}

// 5) Gemini 호출
async function callGeminiForWebInfo(targetUrl, userTopic = "자동 감지") {
    console.log("🚀 callGeminiForWebInfo 시작");
    const htmlSnippet = await fetchHtmlSnippet(targetUrl);
    console.log("✅ HTML snippet 준비 완료 (길이:", htmlSnippet.length, ")");

    const prompt = buildPrompt(htmlSnippet, targetUrl, userTopic);

    const endpoint =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent";

    const payload = {
        contents: [
            {
                parts: [{ text: prompt }],
            },
        ],
    };

    console.log("📡 Gemini로 요청 전송");
    const res = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
    });

    console.log("📨 Gemini 응답 상태:", res.status, res.statusText);
    const rawText = await res.text();

    if (!res.ok) {
        throw new Error(`Gemini API Error (${res.status}): ${rawText}`);
    }

    let json;
    try {
        json = JSON.parse(rawText);
    } catch (e) {
        throw new Error("Gemini 응답 JSON 파싱 실패: " + e.message + "\n원본:\n" + rawText);
    }

    console.log("=== Raw Gemini 응답 일부 ===");
    // console.dir(json, { depth: 4 }); // 너무 길어서 생략 가능

    // content.parts[0].text 안에서 JSON 추출
    let text = "";
    try {
        const cand = json.candidates && json.candidates[0];
        if (
            cand &&
            cand.content &&
            Array.isArray(cand.content.parts) &&
            cand.content.parts[0]
        ) {
            text = cand.content.parts[0].text || "";
        }
    } catch (e) {
        console.error("⚠️ 응답 파싱 중 오류:", e.message);
    }

    if (!text) {
        // 혹시 safetySettings 등으로 인해 차단되었을 수 있음
        if (json.promptFeedback) {
            console.log("Prompt Feedback:", json.promptFeedback);
        }
        throw new Error("Gemini 응답에서 text를 찾지 못했습니다. (Candidate가 없거나 비어있음)");
    }

    console.log("=== Gemini text 응답 ===");
    console.log(text);

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
        throw new Error("Gemini 응답에서 JSON 객체를 찾지 못했습니다.\n" + text);
    }

    let parsed;
    try {
        parsed = JSON.parse(match[0]);
    } catch (e) {
        throw new Error(
            "JSON.parse 실패: " + e.message + "\n원본 텍스트:\n" + text
        );
    }

    let tags = Array.isArray(parsed.tags) ? parsed.tags : [];
    tags = tags.filter((t) => ALL_TAGS.includes(t)).slice(0, 3);

    return {
        title: parsed.title || "",
        summary: parsed.summary || "",
        tags,
    };
}

// 6) CLI 진입점
async function main() {
    console.log("=== test.js 시작 ===");
    const url = process.argv[2];
    const userTopic = process.argv[3] || "자동 감지";

    if (!url) {
        console.error("사용법: node test.js <URL> [초기카테고리]");
        return;
    }

    console.log("테스트 URL:", url);
    console.log("초기 카테고리 힌트:", userTopic);

    try {
        const result = await callGeminiForWebInfo(url, userTopic);
        console.log("\n=== 최종 파싱 결과 ===");
        console.dir(result, { depth: null });
    } catch (e) {
        console.error("\n❌ 에러 발생:", e);
    } finally {
        console.log("=== test.js 종료 ===");
    }
}

// top-level 실행
main().catch((err) => {
    console.error("🌋 main()에서 처리되지 않은 에러:", err);
});
