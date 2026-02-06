# Notion Quiz Maker

Notion 페이지의 내용을 기반으로 사용자가 직접 질문지를 생성할 수 있는 웹 애플리케이션 프로토타입입니다.

## 🌟 주요 기능

- **사용자 인증:** 회원가입 및 JWT(JSON Web Token) 기반의 로그인 기능.
- **Notion 연동:**
  - 사용자의 Notion 통합(Integration) API 키를 안전하게 저장.
  - API 키를 통해 접근 가능한 Notion 페이지 목록 조회.
  - 특정 Notion 페이지의 텍스트 콘텐츠 추출.
- **질문 생성:**
  - Notion 페이지 콘텐츠를 기반으로 질문 생성 요청.
  - (현재는 목(Mock) 데이터 사용) 생성된 질문 목록을 화면에 표시.

## 📂 프로젝트 구조

```
notion-quiz-maker/
├── backend/         # FastAPI 백엔드 서버
│   ├── venv/
│   ├── main.py      # 핵심 API 로직
│   └── ...
├── frontend/        # React 프론트엔드
│   ├── src/
│   │   ├── components/ # 재사용 가능한 UI 컴포넌트
│   │   ├── pages/      # 페이지 단위 컴포넌트
│   │   ├── App.tsx     # 라우팅 로직
│   │   └── main.tsx    # 앱 진입점
│   └── ...
└── README.md        # 프로젝트 안내 파일
```

- **`backend`**: Python 기반의 FastAPI를 사용하여 REST API를 제공합니다. 사용자 관리, Notion API와의 통신, 질문 생성 요청 처리 등을 담당합니다.
- **`frontend`**: TypeScript 기반의 React(Vite 사용)를 사용하여 사용자 인터페이스(UI)를 제공합니다. 사용자는 이 UI를 통해 백엔드 API와 상호작용합니다.

## 🛠️ 기술 스택

- **Backend**: FastAPI, Uvicorn, Passlib (비밀번호 해싱), python-jose (JWT), notion-client
- **Frontend**: React, TypeScript, Vite, Axios, React Router
- **Database**: (프로토타입) In-memory Dictionary (메모리 내 딕셔너리)

---

## ⚙️ 사전 설정 (사용자가 해야 할 일)

애플리케이션을 실행하기 전에 아래의 두 가지 설정을 완료해야 합니다.

### 1. Notion API 키 발급받기

1.  **Notion 통합(Integration) 생성:**
    - [Notion Developers](https://www.notion.so/my-integrations) 페이지로 이동합니다.
    - `+ New integration` 버튼을 클릭하여 새 통합을 만듭니다.
    - 이름을 정하고 `Submit`을 누릅니다.
    - 생성된 후 `Secrets` 탭에서 **Internal Integration Secret** 토큰을 복사합니다. 이 값이 바로 **Notion API 키**입니다. (e.g., `secret_...`)

2.  **페이지에 통합 연결:**
    - 질문을 생성하고 싶은 Notion 페이지로 이동합니다.
    - 우측 상단의 `점 세 개 (...)` 메뉴를 클릭하고 `+ Add connections`를 선택합니다.
    - 방금 생성한 통합의 이름을 검색하고 선택하여 페이지 접근 권한을 부여합니다.

### 2. 백엔드 환경 변수(`.env`) 설정

JWT 토큰 생성에 필요한 `SECRET_KEY`를 환경 변수로 설정해야 합니다. 이 키가 설정되지 않으면 백엔드 서버가 시작되지 않습니다.

1.  **`.env` 파일 생성:**
    `notion-quiz-maker/backend/` 디렉토리 안에 `.env` 파일을 생성합니다.

2.  **`SECRET_KEY` 설정:**
    생성된 `.env` 파일에 아래 내용을 추가하고 `YOUR_ACTUAL_SECRET_KEY` 부분을 임의의 길고 복잡한 문자열로 변경합니다.

    ```
    SECRET_KEY="YOUR_ACTUAL_SECRET_KEY"
    ```
    (예: `SECRET_KEY="a_very_secret_and_long_string_12345_for_jwt_signing"`)

    > **중요:** 이 키는 보안상 매우 중요하며, 외부에 노출되지 않도록 주의해야 합니다. 개발 환경에서는 직접 설정하지만, 실제 배포 시에는 `.env` 파일을 사용하지 않고 호스팅 환경의 안전한 방법으로 환경 변수를 주입해야 합니다.

---

## 🚀 로컬 환경에서 실행 방법

두 개의 터미널(또는 CMD/PowerShell) 창을 사용해야 합니다. 하나는 백엔드용, 다른 하나는 프론트엔드용입니다.

### 1. 백엔드 서버 실행

```bash
# 1. 백엔드 디렉토리로 이동
cd notion-quiz-maker/backend

# 2. Python 가상환경 활성화
# (Windows)
./venv/Scripts/activate
# (macOS/Linux)
source venv/bin/activate

# 3. Uvicorn 서버 실행
# main.py 파일에 있는 app 인스턴스를 실행합니다. --reload 옵션은 코드 변경 시 자동 재시작을 지원합니다.
uvicorn main:app --reload
```
- 서버가 정상적으로 실행되면 `http://127.0.0.1:8000` 에서 API가 활성화됩니다.

### 2. 프론트엔드 서버 실행

```bash
# 1. 프론트엔드 디렉토리로 이동
cd notion-quiz-maker/frontend

# 2. (최초 한 번) 필요한 패키지 설치
npm install

# 3. Vite 개발 서버 실행
npm run dev
```
- 서버가 정상적으로 실행되면 브라우저에서 `http://localhost:5173` 로 접속할 수 있습니다.

---

## 📖 애플리케이션 사용 방법

1.  브라우저에서 `http://localhost:5173` 에 접속합니다.
2.  (현재 구현상) 로그인 페이지가 기본 페이지입니다. 회원가입을 위해 Register 링크를 클릭합니다.
3.  사용자 정보를 입력하여 회원가입을 완료합니다.
4.  로그인 페이지에서 방금 생성한 계정으로 로그인합니다.
5.  로그인에 성공하면 대시보드 페이지로 이동합니다.
6.  **"Notion API Key Configuration"** 섹션에 위에서 발급받은 **Notion API 키**를 입력하고 `Save API Key` 버튼을 누릅니다.
7.  키가 성공적으로 저장되면 **"Your Notion Pages"** 섹션에 해당 키로 접근 가능한 페이지 목록이 나타납니다.
8.  **"Generate Questions"** 섹션에서 질문을 생성할 페이지를 선택하고, 질문 수 등을 조정한 뒤 `Generate Questions` 버튼을 누릅니다.
9.  하단에 생성된 질문 목록(현재는 목 데이터)이 표시됩니다.

---

## 🔬 기술적 설명

### 데이터베이스 (DB) 연동

- 이 프로토타입은 **별도의 데이터베이스를 사용하지 않습니다.**
- 대신, `backend/main.py` 파일 안에 있는 `fake_users_db` 라는 Python **딕셔너리(Dictionary)를 메모리 내 데이터베이스로 사용**합니다.
- **장점:** 설정이 간편하고 빠르게 프로토타입을 만들 수 있습니다.
- **단점:** 백엔드 서버가 재시작되면 모든 사용자 정보와 Notion API 키가 초기화됩니다.
- **향후 실제 DB로 전환하려면?**
  1.  `SQLAlchemy` 와 같은 ORM(Object-Relational Mapper)을 설치합니다.
  2.  `database.py` 파일을 만들어 SQLite 또는 다른 DB(PostgreSQL 등) 연결 설정을 추가합니다.
  3.  `fake_users_db`를 참조하는 모든 코드를 DB 세션을 통해 데이터를 조회하고 수정하도록 변경해야 합니다.

### 질문 생성 (LLM 연동)

- 현재 질문 생성 기능은 실제 대규모 언어 모델(LLM)을 호출하지 않습니다.
- 대신, `backend/main.py` 파일의 `generate_questions_with_llm` 함수가 미리 준비된 **목(Mock) 데이터를 반환**합니다.
- **향후 실제 LLM으로 교체하려면?**
  1.  사용하려는 LLM의 Python 라이브러리를 설치합니다. (예: `google-generativeai` for Gemini)
  2.  `generate_questions_with_llm` 함수 내부 로직을 실제 API 호출 코드로 변경합니다. Notion에서 추출한 텍스트를 프롬프트에 담아 API에 전송하고, 반환된 결과를 파싱하여 `GeneratedQuestion` 모델에 맞게 가공해야 합니다.

## 🔮 향후 개선 방향

- **실제 데이터베이스 연동:** SQLite, PostgreSQL 등 영구적인 데이터베이스를 도입하여 사용자 데이터가 유지되도록 개선.
- **실제 LLM 연동:** Gemini, GPT 등 실제 대규모 언어 모델 API를 연동하여 동적으로 질문을 생성하도록 개선.
- **UI/UX 고도화:** UI 라이브러리(e.g., Material-UI, Ant Design)를 도입하여 디자인을 개선하고 사용자 경험을 향상.
- **비동기 처리:** 질문 생성과 같이 오래 걸릴 수 있는 작업은 Celery 와 같은 도구를 사용해 백그라운드에서 비동기적으로 처리.
- **보안 강화:** `SECRET_KEY`를 `.env` 파일로 분리했습니다. 향후 Notion API 키와 같은 다른 민감 정보도 동일하게 관리하도록 개선할 수 있습니다.
- **테스트 코드 작성:** Pytest, React Testing Library 등을 사용하여 코드의 안정성 확보.
