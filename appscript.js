/*********************************
 * 공통 설정
 *********************************/
const SHEET_URL = "https://docs.google.com/spreadsheets/d/1wxI7S7SrPpIc_efZ48jN4DiLTM3Z70fDvxicVgND65o/edit";
const SHEET_ID = "....";  // 필요 시 사용
const GEMINI_API_KEY = "YOUR_KEY";

/*********************************
 * 엔트리 포인트
 *********************************/
function doGet(req) {
    var action = req.parameter.action;
    var table_req = req.parameter.table;

    var db = SpreadsheetApp.openByUrl(SHEET_URL);
    var table = db.getSheetByName(table_req);
    var ret;

    switch (action) {
        case "read":
            ret = Read(req, table);
            break;
        case "insert":
            ret = Insert(req, table);
            break;
        case "update":
            ret = Update(req, table);
            break;
        case "delete":
            ret = Delete(req, table);
            break;
        case "insert_web":
            ret = InsertWeb(req, db);
            break;

        default:
            ret = { success: false, data: { error: "Unknown action" } };
            break;
    }

    return response().json(ret);
}

/*********************************
 * 기본 CRUD
 *********************************/
function Read(request, table) {
    var request_id = request.parameter.id ? Number(request.parameter.id) : null;
    var rows = _read(table, request_id);

    // webs 전용 필터링: user_id가 들어온 경우
    var userId = request.parameter.user_id;
    if (userId && table.getName() === "webs") {
        rows = rows.filter(function (r) {
            // is_demo == 1 이거나, user_id == 현재 유저
            return String(r.is_demo) === "1" || String(r.user_id) === String(userId);
        });
    }

    return {
        success: true,
        data: rows
    };
}

function Insert(request, table) {
    var last_col = table.getLastColumn();
    var first_row = table.getRange(1, 1, 1, last_col).getValues();
    var headers = first_row.shift();
    var data = JSON.parse(request.parameter.data);
    var new_row;
    var result = {};

    if (request.parameter.table == "review") {
        sendMail(data.email);
    }

    try {
        new_row = prepareRow(data, headers);
        table.appendRow(new_row);

        result.success = true;
        result.data = data;
    } catch (error) {
        result.success = false;
        result.data = { error: error.message };
    }
    return result;
}

function Update(request, table) {
    var last_col = table.getLastColumn();
    var first_row = table.getRange(1, 1, 1, last_col).getValues();
    var headers = first_row.shift();

    var request_id = Number(request.parameter.id);
    var current_data = _read(table, request_id);
    var data = typeof request.postData === "object" && request.postData.contents
        ? JSON.parse(request.postData.contents)
        : JSON.parse(request.parameter.data || "{}");

    var result = {};

    try {
        var current_row = current_data.row;
        for (var object_key in data) {
            var current_col = headers.indexOf(object_key) + 1;
            if (current_col > 0) {
                table.getRange(current_row, current_col).setValue(data[object_key]);
                current_data[object_key] = data[object_key];
            }
        }
        result.success = true;
        result.data = current_data;
    } catch (error) {
        result.success = false;
        result.data = { error: error.message };
    }

    return result;
}

function Delete(request, table) {
    var request_id = Number(request.parameter.id);
    var current_data = _read(table, request_id);

    table.deleteRow(current_data.row);

    return {
        success: true,
        data: current_data
    };
}

/*********************************
 * webs 전용 Insert + Gemini
 *********************************/
function InsertWeb(request, db) {
    var body = {};

    try {
        if (request.postData && request.postData.contents) {
            // POST(application/json 또는 text/plain)로 들어온 경우
            body = JSON.parse(request.postData.contents);
        } else if (request.parameter.data) {
            // GET ?data=... 로 들어온 경우
            body = JSON.parse(request.parameter.data);
        }
    } catch (e) {
        return { success: false, data: { error: "Invalid JSON body" } };
    }

    var userId = body.user_id;
    var url = body.url;
    var userTopic = body.user_topic || "자동 감지";
    var remindAt = body.remind_at || "";

    if (!url || !userId) {
        return { success: false, data: { error: "url or user_id missing" } };
    }

    var webs = db.getSheetByName("webs");
    if (!webs) {
        return { success: false, data: { error: "webs sheet not found" } };
    }

    // 1) URL HTML 일부 가져오기
    var htmlSnippet = "";
    try {
        var fetchRes = UrlFetchApp.fetch(url, {
            muteHttpExceptions: true,
            followRedirects: true,
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
            }
        });
        var content = fetchRes.getContentText("UTF-8");  // ★ 여기!
        htmlSnippet = content.slice(0, 20000);
    } catch (e) {
        Logger.log("HTML fetch 실패: " + e);
        htmlSnippet = "";
    }

    // 2) Gemini 호출
    var geminiResult = callGeminiForWebInfo(htmlSnippet, url, userTopic);

    var title = geminiResult.title || ("새로 추가된 글 (" + url + ")");
    var summary = geminiResult.summary || "요약을 생성하지 못했습니다.";
    var tagsArr = geminiResult.tags || [];
    var tagsStr = tagsArr.join(",");

    // 3) webs 시트에 저장
    var lastRow = webs.getLastRow();
    var newId = lastRow >= 2 ? (Number(webs.getRange(lastRow, 1).getValue()) + 1) : 1; // A열 id 기준

    var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");

    var row = [
        newId,          // id
        userId,         // user_id
        0,              // is_demo
        url,            // url
        title,          // title
        summary,        // summary
        tagsStr,        // tags
        "1",            // status (1 = 안 읽음)
        today,          // added_at
        remindAt        // remind_at
    ];
    webs.appendRow(row);

    // 4) 프론트에 돌려줄 JSON
    var json = {
        id: newId,
        user_id: userId,
        is_demo: 0,
        url: url,
        title: title,
        summary: summary,
        tags: tagsStr,
        status: "1",
        added_at: today,
        remind_at: remindAt
    };

    return { success: true, data: json };
}

/*********************************
 * Gemini 호출
 *********************************/
function callGeminiForWebInfo(htmlSnippet, url, userTopic) {
    var allTags = [
        "뉴스", "교육", "코미디", "일상", "게임", "음악", "영화", "스포츠", "패션", "뷰티", "기술", "음식", "여행", "건강", "과학", "역사",
        "정치", "경제", "재테크", "자기계발", "예술", "반려동물", "환경", "리뷰", "공예", "취미", "오디오", "팟캐스트", "만화", "아동", "종교",
        "문화", "쇼핑", "부동산", "법률", "의학", "IT", "문학", "시사", "조리", "힐링", "ASMR"
    ];

    var userTopicHint = (userTopic && userTopic !== "자동 감지") ? userTopic : "";

    var prompt = [
        "다음은 어떤 웹 페이지의 HTML 일부입니다.",
        "이 내용을 바탕으로 아래 세 가지를 JSON 형식으로 출력해주세요.",
        "",
        "1) title: 한국어로 된 제목 (너무 길지 않게, 핵심 주제만 담아주세요)",
        "2) summary: 한국어로 50~100자 정도의 핵심 내용 요약 (한 단락, 문장 여러 개 가능)",
        "3) tags: 아래 카테고리 목록 중에서 이 페이지와 가장 관련이 높은 주제 1~3개 (문자열 배열)",
        "",
        "카테고리 목록:",
        allTags.join(", "),
        "",
        (userTopicHint
            ? ('사용자가 선택한 초기 카테고리 힌트: "' +
                userTopicHint +
                '"\n이 힌트와 실제 내용을 함께 고려해서 태그를 골라주세요.\n')
            : ""),
        "반드시 다음 형식의 JSON만 출력하세요. 추가 설명 문장은 금지합니다.",
        "",
        "{",
        '  "title": "제목",',
        '  "summary": "요약",',
        '  "tags": ["카테고리1", "카테고리2"]',
        "}",
        "",
        "HTML 일부:",
        htmlSnippet || "(내용을 가져오지 못했습니다. URL과 추측만으로 대략적인 제목/요약/태그를 생성해주세요: " + url + ")"
    ].join("\n");

    try {
        var endpoint =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent";

        var payload = {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        };

        var options = {
            method: "post",
            contentType: "application/json",
            muteHttpExceptions: true,
            headers: {
                "x-goog-api-key": GEMINI_API_KEY
            },
            payload: JSON.stringify(payload)
        };

        var res = UrlFetchApp.fetch(endpoint, options);
        var statusCode = res.getResponseCode();
        var body = res.getContentText();

        Logger.log("Gemini status: " + statusCode);
        Logger.log("Gemini raw body: " + body);

        if (statusCode < 200 || statusCode >= 300) {
            Logger.log("Gemini HTTP error body: " + body);
            return { title: "", summary: "", tags: [] };
        }

        var json = JSON.parse(body);

        if (json.error) {
            Logger.log("Gemini API error: " + JSON.stringify(json.error));
            return { title: "", summary: "", tags: [] };
        }

        var text = "";
        if (json.candidates &&
            json.candidates.length > 0 &&
            json.candidates[0].content &&
            json.candidates[0].content.parts &&
            json.candidates[0].content.parts.length > 0 &&
            json.candidates[0].content.parts[0].text) {
            text = json.candidates[0].content.parts[0].text;
        }

        if (!text) {
            Logger.log("Gemini 응답에서 text를 찾지 못했습니다.");
            return { title: "", summary: "", tags: [] };
        }

        var match = text.match(/\{[\s\S]*\}/);
        if (!match) {
            Logger.log("Gemini 응답에서 JSON 객체를 찾지 못했습니다.\n" + text);
            return { title: "", summary: "", tags: [] };
        }

        var parsed;
        try {
            parsed = JSON.parse(match[0]);
        } catch (e) {
            Logger.log("JSON.parse 실패: " + e + "\n원본 텍스트:\n" + text);
            return { title: "", summary: "", tags: [] };
        }

        var tags = parsed.tags || [];
        tags = tags
            .filter(function (t) {
                return allTags.indexOf(t) !== -1;
            })
            .slice(0, 3);

        return {
            title: parsed.title || "",
            summary: parsed.summary || "",
            tags: tags
        };

    } catch (e) {
        Logger.log("Gemini 호출 실패: " + e);
    }

    return {
        title: "",
        summary: "",
        tags: []
    };
}


function TEST_InsertWeb() {
    var fakeReq = {
        parameter: {
            action: "insert_web",
            table: "webs",
            data: JSON.stringify({
                user_id: "DEBUG_USER",
                url: "https://www.amc.seoul.kr/asan/healthinfo/disease/diseaseDetail.do?contentId=32239",
                user_topic: "자동 감지",
                remind_at: "2025-12-14"
            })
        }
    };

    var db = SpreadsheetApp.openByUrl(SHEET_URL);
    var result = InsertWeb(fakeReq, db);

    Logger.log("TEST_InsertWeb 결과: " + JSON.stringify(result));
}



/*********************************
 * 응답 헬퍼
 *********************************/
function response() {
    return {
        json: function (data) {
            return ContentService.createTextOutput(
                JSON.stringify(data)
            ).setMimeType(ContentService.MimeType.JSON);
        },
        jsonp: function (req, data) {
            return ContentService.createTextOutput(
                req.parameters.callback + '(' + JSON.stringify(data) + ')'
            ).setMimeType(ContentService.MimeType.JAVASCRIPT);
        }
    };
}

/*********************************
 * 시트 읽기/정렬
 *********************************/
function _read(sheet, id) {
    var data = sheet.getDataRange().getValues();
    var header = data.shift();

    var result = data.map(function (row, indx) {
        var reduced = header.reduce(function (acc, cur, idx) {
            acc[cur] = row[idx];
            return acc;
        }, {});
        reduced.row = indx + 2;  // 실제 시트 row 번호
        return reduced;
    });

    if (id) {
        var filtered = result.filter(function (record) {
            return Number(record.id) === id;
        });
        return filtered.shift();
    }
    return result;
}

/*********************************
 * Insert용 컬럼 매핑
 *********************************/
function prepareRow(object_to_sort, array_with_order) {
    var sorted_array = [];

    for (var i = 0; i < array_with_order.length; i++) {
        var value = object_to_sort[array_with_order[i]];
        if (typeof value === 'undefined') {
            throw new Error("The attribute/column <" + array_with_order[i] + "> is missing.");
        } else {
            sorted_array[i] = value;
        }
    }
    return sorted_array;
}

/*********************************
 * 리뷰 메일 발송
 *********************************/
function sendMail(email) {
    try {
        MailApp.sendEmail({
            to: email,
            subject: "소중한 후기 감사합니다.",
            htmlBody: "<html><p>안녕하세요, Linder 제작자입니다.<br><br>추후에, 후기를 반영한 업데이트를 완료한 후, 다시 연락드리겠습니다. 소중한 후기를 최대한 빨리 반영할 수 있도록, 최선을 다하겠습니다.<br>감사합니다.<br><br>Linder 제작자 드림</p></html>"
        });
    } catch (e) {
        Logger.log(e);
    }
}



