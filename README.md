# Linder — ReadLater+

**Linder(ReadLater+)**는  
“다시 보고 싶은 링크를 *잊기 전에* 모아서, AI 요약/태그와 리마인드로 읽기 완주를 돕는” 웹 서비스입니다.

- 이미 배포된 서비스: **https://lidner.netlify.app/**
- 데이터베이스(Google Sheets):  
  https://docs.google.com/spreadsheets/d/1wxI7S7SrPpIc_efZ48jN4DiLTM3Z70fDvxicVgND65o/edit#gid=1819200189  

이 README는 **`index.html` + `app.html` + `appscript.js`** 전체 구조를 설명하고,  
서비스를 어떻게 사용하는지 / 코드를 어떻게 활용하는지 정리한 문서입니다.

---

## 1. 전체 구조 개요

Linder는 다음 세 부분으로 구성됩니다.

1. **Landing 페이지 (`index.html`)**
   - 서비스 소개 / 리뷰 수집 / 뉴스레터 / 기능 안내 / 사용 흐름 안내
   - 홈 화면 최상단에 **리뷰 카드**를 배치하여 이메일·후기를 적극적으로 받도록 설계
   - 여러 재미있는 이미지와 스크롤형 섹션(About / Features / How it works / Start)으로 **스크롤을 내리는 재미와 세련된 디자인**을 강조
   - 모든 주요 버튼(“시작하기”, “Member Login”, 섹션 내 CTA)이 **`app.html`로 연결**되도록 통일하여 자연스럽게 앱으로 유도
   - 방문/리뷰/VIP(관심 사용자)를 Google Sheets에 기록하는 **가벼운 분석/로그 시스템** 포함

2. **앱 페이지 (`app.html`)**
   - 실제로 링크를 저장·관리하는 **핵심 구현 페이지**
   - 쿠키(`user`) 기반으로 **자동 로그인처럼 동작** → 같은 브라우저에서는 별도 로그인 없이 “나만의 링크 공간”으로 바로 진입
   - 링크 입력 → AI 요약·태그 생성(Gemini) → 시트에 저장 → 안 읽음/읽음/태그/리마인드 기반으로 정리
   - 정렬(날짜/태그), 보기(1·2·3열), 태그 필터, 읽음 표시, 삭제, URL 복사 기능 제공
   - 온보딩 투어(Linder 사용법)와 데모 카드로 **처음 방문자도 흐름을 한 번에 이해**할 수 있게 설계

3. **백엔드 (Google Apps Script, `appscript.js`)**
   - Google Sheets를 DB처럼 사용하는 REST-ish API
   - 엔드포인트: `https://script.google.com/macros/s/.../exec`
   - 지원 액션:
     - `action=read` / `insert` / `update` / `delete`
     - `action=insert_web` : URL을 받아 HTML 일부를 긁고, Gemini API로 **제목/요약/태그**를 생성하여 `webs` 시트에 저장
   - 공통 응답 포맷: `{ success: boolean, data: ... }`

---

## 2. 데이터베이스 구조 (Google Sheets)

스프레드시트 URL:  
https://docs.google.com/spreadsheets/d/1wxI7S7SrPpIc_efZ48jN4DiLTM3Z70fDvxicVgND65o/edit#gid=1819200189

주요 시트(테이블) 역할은 다음과 같습니다.

- **`webs`**
  - 사용자별로 저장된 웹 링크 목록
  - 주요 컬럼(예시):
    - `id` (숫자, PK)
    - `user_id` (쿠키로 생성한 유저 식별자)
    - `is_demo` (1: 데모 데이터, 0: 실제 사용자 데이터)
    - `url`, `title`, `summary`, `tags`
    - `status` (`1` = 안 읽음, `0` = 읽음, `2` = 소프트 삭제)
    - `added_at` (추가 날짜)
    - `remind_at` (리마인드 날짜)

- **`visitors_f`**
  - 랜딩 페이지 방문 로그
  - `id`, `landingUrl`, `ip`, `referer`, `time_stamp`, `utm`, `device` 등

- **`review_f`**
  - 랜딩에서 받은 이메일 + 후기
  - 입력 시 자동으로 감사 메일 발송

- **`vips_f`**
  - “시작하기” / “Member Login” 등 **app으로 진입하려고 버튼을 누른 유저 로그**
  - 실제 서비스 전환을 추적하기 위한 용도

---

## 3. 랜딩 페이지 (`index.html`)

### 3.1. 디자인 & UX 포인트

- 상단 NAV + Hero 섹션
  - **“다시 보고 싶은 링크, 잊기 전에 모아두세요.”**라는 메시지와 함께 브랜드 아이덴티티 제시
  - `시작하기` 버튼을 크게 배치해 바로 `app.html`로 이동
- **리뷰/피드백 카드(히어로 우측)**  
  → “알림 신청 & 피드백” 카드가 Hero 영역에 함께 올라와 있어, 방문 직후 **후기를 남기도록 유도**
- 스크롤 구조
  - `About Linder`: 서비스 철학과 활용 예시(논문, 애니, 웹 등)
  - `뉴스레터 구독`: 이용 통계/사용법/업데이트를 이메일로 보내는 구독 섹션
  - `핵심 기능`: 한 줄 URL 저장, 주제 태깅, 읽은 문서 정리, 리마인드 네 가지 기능 카드
  - `어떻게 사용하나요?`: 01~04 단계 이미지 카드로 실제 흐름 시각화
  - `Linder 시작하기`: 앱으로 넘어가는 큰 CTA 버튼
- **여러 이미지 섹션이 자연스럽게 이어지는 파도형 배경과 카드형 레이아웃**으로  
  스크롤을 내려도 지루하지 않고, 자연스럽게 앱 진입까지 안내되도록 설계

### 3.2. 버튼 → 앱 페이지 흐름

모든 주요 CTA는 **`app.html`로 연결**됩니다.

- Hero의 `시작하기` 버튼 (`#go-app`)
- Navbar의 `Member Login` 버튼 (`#gooo-app`)
- How it works 섹션 각 Step의 `시작하기` 버튼
- Start 섹션의 `Linder 시작!` 버튼 (`#goo-app`)

각 버튼 클릭 시:

- Google Apps Script (`addrScript`)로 `vips_f`에 클릭 로그(`user_id`, `time_stamp`)를 기록
- 이후 `app.html`로 이동 → 쿠키 기반 자동 로그인으로 곧바로 개인 공간으로 유도

### 3.3. 방문자/리뷰 로깅

- 페이지 로드 시:
  - `getUVfromCookie()`로 쿠키(`user`)에서 유저 ID를 가져오고, 없으면 6자리 랜덤 문자열 생성 후 180일 유지
  - IP(JSONP), referrer, landing URL, utm parameter, device(모바일/데스크톱)를 합쳐 `visitors_f`에 기록

- 리뷰 제출:
  - 이메일 + 후기 입력 후 `review_f` 시트에 저장
  - 동시에 `sendMail()`을 통해 감사 메일 발송
  - 성공 시 팝업(`simple-popup`)으로 “제출 완료!” UI 표시

---

## 4. 앱 페이지 (`app.html`)

Linder의 **핵심 기능**은 `app.html`에서 동작합니다.

### 4.1. 자동 로그인과 첫 화면

- 페이지 로드 시:
  - `getUVfromCookie()`로 `user` 쿠키를 읽고, 없으면 새로 생성 (180일 유지)
  - 상단에 **“안녕하세요, Linder입니다! 쿠키로 자동 로그인 하였습니다.”** 토스트를 1.5초 동안 표시
  - 이 쿠키 값이 그대로 `user_id`가 되어 Google Sheets의 `webs` 레코드와 매핑됩니다.  
    → 별도의 회원가입/로그인 없이 **브라우저 단위 계정**처럼 동작

- `loadArticlesFromServer()`:
  - `action=read&table=webs&user_id={cookie}` 호출
  - `is_demo = 1` 인 데모 데이터 + 해당 유저 데이터만 가져와 프론트 상태 `articles`에 로드
  - 실제 링크를 하나 이상 저장하면 데모 데이터는 자동으로 숨김

### 4.2. 상단 UI

- **Top Bar**
  - 좌측: Linder 로고, 홈으로 가는 링크(`index.html`)
  - 우측: **안 읽음 / 읽음** 토글(segmented control)
    - `activeTab = "UNREAD" | "read"` 상태로 필터링

- **입력 영역**
  - URL 입력: `#urlInput`
  - 주제 선택 드롭다운: `#topicSelect` (자동 감지/교육/게임/패션/뷰티/스포츠/경제/IT 등)
  - 리마인드 날짜: `#remindPicker` (기본값 = 오늘 기준 +14일)
  - 추가 버튼: `#addBtn` → 클릭 시 `addArticle()` 실행

### 4.3. 링크 추가 흐름

1. 사용자가 URL + 주제 + 리마인드 날짜를 설정하고 “추가” 버튼 클릭
2. `addArticle()`:
   - `addrScript?action=insert_web&table=webs&data=...` 로 Google Apps Script 호출
   - `user_id`, `url`, `user_topic`, `remind_at` 포함

3. Apps Script `InsertWeb()`:
   - URL에서 HTML 일부(최대 20,000자)를 가져옴
   - `callGeminiForWebInfo()`로 Gemini API에 프롬프트 전송
     - 제목(title), 요약(summary), 태그(tags[])를 한국어로 생성
     - 태그는 미리 정의된 allTags 목록 중 1~3개만 선택
   - `webs` 시트에 새 레코드 한 줄 추가
   - 생성된 JSON(제목/요약/태그 포함)을 프론트에 반환

4. 프론트:
   - 응답을 받아 `articles` 배열 맨 앞에 `unshift`
   - 입력창 초기화 후 `render()`로 목록 다시 그림

사용자는 결과적으로  
**“URL만 붙여넣으면, AI가 제목/요약/태그를 채워서 깔끔한 카드 하나로 정리되는 경험”**을 하게 됩니다.

### 4.4. 목록/정렬/보기/필터

- **정렬(정렬 Chips, `#sortToggle`)**
  - 날짜(최신) / 날짜(오래된) / 태그
  - 태그 정렬 선택 시:
    - 현재 데이터에서 등장한 태그들을 수집해 `tagFilterButtons` 영역에 버튼을 생성
    - 각 태그 버튼을 클릭하여 **여러 태그를 선택·해제하며 필터링**

- **보기(열 수, `#viewToggle`)**
  - 1열 / 2열 / 3열
  - 그리드 레이아웃 (`#listRoot.cols-1|2|3`)으로 반응형 배치

- **카드 내부 기능**
  - `열기`: 새 탭에서 링크 오픈
  - `읽음으로 표시`: status=0으로 바꾸고 `updateArticleStatusOnServer()` 호출
  - `문서 삭제`: status=2로 바꾸는 소프트 삭제
  - `복사`: `navigator.clipboard.writeText()`로 URL 클립보드 복사

- **상태별 탭**
  - 안 읽음 탭: `status === "1"`
  - 읽음 탭: `status === "0"`
  - 삭제된 항목(`"2"`)은 기본 렌더링에서 제외

### 4.5. 온보딩 튜토리얼 (Linder 사용법)

- 데모 데이터만 있는 상태에서 처음 접속한 경우:
  - `TOUR_DONE_KEY`가 없으면 `tourIntro` 오버레이 표시  
    → “등록하신 링크가 없군요. 예시 링크로 짧게 소개해드릴까요?”

- “소개해주세요” 선택 시:
  - 4단계 투어 진행 (`tourStep = 1..4`)
    1. 저장된 글 **열기 버튼** 설명
    2. **읽음으로 표시** 기능 설명
    3. 읽음 탭에서 **읽은 글 목록**을 보는 방법
    4. URL 입력칸 + 리마인드 날짜 + 추가 버튼을 강조하며 **나만의 링크를 추가하라**는 안내

- “괜찮아요” 선택 시:
  - 투어는 건너뛰지만, 상단의 **“Linder 사용법” 버튼**을 강조하고
  - 언제든지 다시 투어를 볼 수 있다는 안내(`tourReplayHint`) 표시

---

## 5. 실제 사용 흐름 요약

-사용자는 **https://lidner.netlify.app/**에 접속합니다.

- 홈에서 스크롤을 내리며:

-- 서비스의 목적과 시나리오를 확인하고,

-- 상단 리뷰 카드로는 이메일과 후기를 남길 수 있으며,

-- 여러 이미지와 파도형 레이아웃을 통해 재미있게 전체 기능을 훑어본 뒤,

-- 어떤 버튼을 누르든 자연스럽게 app.html로 이동합니다.

- app.html에 들어오면:

-- 쿠키 기반 자동 로그인으로 “안녕하세요, Linder입니다! 쿠키로 자동 로그인 하였습니다.” 토스트가 뜨고,

-- 안 읽음 목록/데모 카드/온보딩 투어를 통해 UI를 익힙니다.

- URL을 입력하고 추가하면:

-- AI가 제목/요약/태그를 채운 카드가 생성되고,

-- 읽음/정렬/태그/리마인드 기능으로 읽기 경험을 설계할 수 있습니다.

- 브라우저를 다시 열어도:

-- 같은 쿠키(user)로 Google Sheets의 동일 데이터에 접근 → 자연스럽게 “계속 이어서” 사용할 수 있습니다.

## 결론적으로, 이 코드베이스는 랜딩에서 리뷰와 관심 유저를 최대한 끌어올 수 있는 디자인 쿠키 기반 “무마찰” 로그인 흐름 Google Sheets + Apps Script + Gemini API를 활용한 간단하지만 강력한 백엔드 링크 → AI 요약/태그 → 읽음/리마인드 관리 전체 파이프라인을 하나로 묶어, **“읽기까지의 여정 전체를 도와주는 ReadLater+ 서비스”**를 구현합니다.