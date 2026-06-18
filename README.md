# 골목길 AI — 홍보물 만들기

은평구 소상공인을 위한 AI 홍보 포스터 생성 웹앱 프로토타입.  
업종·홍보 내용·참고 사진을 입력하면 Gemini AI가 홍보 포스터 이미지를 자동으로 만들어줍니다.

---

## 1. 전체 폴더 구조 설명

```
golmokgil-ai/
│
├── src/                        ← 화면(프론트엔드) 코드
│   ├── App.jsx                 ← 메인 화면 전체 (입력 폼 + 미리보기)
│   ├── main.jsx                ← React 앱 시작점 (건드릴 필요 없음)
│   └── index.css               ← 전역 스타일
│
├── netlify/
│   └── functions/
│       └── generate-image.js   ← ★ 핵심: Gemini API를 호출하는 서버 함수
│                                  (API 키가 여기서만 사용됨 — 브라우저에 노출 안 됨)
│
├── index.html                  ← HTML 진입점
├── vite.config.js              ← 개발 서버 설정
├── tailwind.config.js          ← CSS 프레임워크 설정
├── postcss.config.js           ← CSS 빌드 도구 설정
├── netlify.toml                ← Netlify 빌드·배포 설정
├── package.json                ← 프로젝트 패키지 목록
├── .env.example                ← 환경변수 예시 파일 (API 키 입력 위치 안내)
├── .gitignore                  ← GitHub에 올리지 않을 파일 목록
└── README.md                   ← 이 파일
```

**동작 흐름 요약:**  
사용자 입력 → 브라우저(React) → `/api/generate-image`(Netlify Function) → Gemini API → 이미지 반환 → 화면 표시

---

## 2. Gemini API 키 발급 및 입력 방법

### 발급 방법
1. 브라우저에서 **Google AI Studio** 접속: https://aistudio.google.com/app/apikey
2. Google 계정으로 로그인
3. "Create API key" 버튼 클릭 → 키 복사 (예: `AIzaSy...`)

### 로컬 테스트용 입력
1. 프로젝트 최상위 폴더에서 `.env.example` 파일을 복사해 `.env` 파일 생성:
   ```
   .env.example  →  .env  (파일 이름만 바꾸면 됨)
   ```
2. `.env` 파일을 열어 `여기에_발급받은_API_키를_붙여넣으세요` 부분을 실제 키로 교체:
   ```
   GEMINI_API_KEY=AIzaSyABC123...실제키...
   ```
3. `.env` 파일은 **절대 GitHub에 올리지 마세요** (`.gitignore`에 이미 포함됨)

---

## 3. GitHub 저장소 만들고 코드 올리기

> Git과 GitHub 계정이 필요합니다. 없다면 https://github.com 에서 먼저 가입하세요.

### 3-1. GitHub에서 새 저장소 만들기
1. GitHub 로그인 → 오른쪽 위 `+` 버튼 → **New repository**
2. Repository name: `golmokgil-ai`
3. Public 또는 Private 선택
4. **"Add a README file" 체크 해제** (우리가 이미 만들었으므로)
5. **Create repository** 클릭
6. 생성된 페이지에서 주소 복사 (예: `https://github.com/내아이디/golmokgil-ai.git`)

### 3-2. 터미널에서 코드 올리기
`golmokgil-ai` 폴더 안에서 아래 명령어를 순서대로 실행:

```bash
git init
git add .
git commit -m "첫 번째 커밋: 골목길 AI 프로토타입"
git branch -M main
git remote add origin https://github.com/내아이디/golmokgil-ai.git
git push -u origin main
```

---

## 4. Netlify 배포 및 환경변수 입력

### 4-1. Netlify 가입 및 연결
1. https://netlify.com 에서 **GitHub 계정으로 가입/로그인**
2. 대시보드에서 **"Add new site" → "Import an existing project"** 클릭
3. **GitHub** 선택 → 방금 만든 `golmokgil-ai` 저장소 선택
4. Build 설정 확인 (자동으로 채워짐):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **"Deploy site"** 클릭

### 4-2. 환경변수(API 키) 입력
> **이 단계를 빠뜨리면 이미지 생성이 작동하지 않습니다!**

1. Netlify 사이트 대시보드 → **Site configuration** 탭
2. 왼쪽 메뉴에서 **Environment variables** 클릭
3. **"Add a variable"** 버튼 클릭
4. Key: `GEMINI_API_KEY` / Value: 발급받은 Gemini API 키 붙여넣기
5. **Save** 클릭
6. **Deploys** 탭으로 이동 → **"Trigger deploy"** 클릭 (환경변수 반영을 위해 재배포)

---

## 5. 로컬에서 먼저 테스트하는 방법

> Node.js(v18 이상)가 설치되어 있어야 합니다. https://nodejs.org 에서 LTS 버전 설치

### 5-1. 의존성 패키지 설치 (최초 1회)
```bash
cd golmokgil-ai
npm install
```

### 5-2. `.env` 파일에 API 키 입력 (2번 항목 참고)

### 5-3. 개발 서버 실행
```bash
npm run dev
```
터미널에 `http://localhost:8888` 주소가 나타나면 브라우저에서 열기

> `npm run dev`는 내부적으로 `netlify dev`를 실행합니다.  
> Vite(화면 서버)와 Netlify Functions(API 서버)를 동시에 띄워줍니다.

---

## 6. 배포 후 이미지 생성 동작 확인 방법

1. Netlify 대시보드의 **"Domain"** 탭에서 배포 주소 확인 (예: `https://golmokgil-ai.netlify.app`)
2. 주소를 브라우저에서 열기
3. 업종 선택 → 홍보 주제 입력 → 분위기 선택 → **"AI로 생성하기"** 클릭
4. 오른쪽 미리보기 영역에 로딩 표시가 나타나고 10~20초 후 이미지가 표시되면 성공

### 오류가 날 경우 확인 사항
| 증상 | 원인 | 해결 |
|------|------|------|
| "AI 이미지 생성 중 오류" 메시지 | API 키 미입력 또는 오류 | Netlify 환경변수 재확인 후 재배포 |
| 화면은 뜨는데 버튼 눌러도 반응 없음 | Functions 미배포 | Netlify 로그에서 Function 오류 확인 |
| 로컬에서만 안 됨 | `.env` 파일 없거나 키 오류 | `.env` 파일 내용 재확인 |

Netlify 오류 로그 확인: 사이트 대시보드 → **Functions** 탭 → `generate-image` 클릭 → 로그 확인

---

## 기술 스택

- **프론트엔드**: React 18 + Vite + Tailwind CSS
- **서버리스 함수**: Netlify Functions v2 (Node.js)
- **AI 이미지 생성**: Google Gemini 2.5 Flash Image (`gemini-2.5-flash-image`)
- **호스팅**: Netlify (정적 사이트 + 서버리스 함수)
