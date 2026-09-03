# CLAUDE.md

윤봉봉 개인 포트폴리오 사이트.

## 커뮤니케이션 규칙

- 사용자에게 답변할 때는 항상 공손한 존댓말을 사용한다.

## 프로젝트

- 디자이너/크리에이티브 포트폴리오
- Vite + React 기반 SPA. `npm run dev`로 로컬 실행하고 `npm run build`로 빌드
- React Router `HashRouter` 사용: 홈 `/#/`, 상세 `/#/projects/{slug}`
- `src/pages/HomePage.jsx` — 메인 (Hero / Projects / Experience / Contact)
- `src/pages/ProjectPage.jsx` — 프로젝트 상세
- `src/data/` — 프로젝트와 경력 콘텐츠의 단일 데이터 소스
- `DESIGN.md` — **디자인 시스템 (단일 진실 원천)**

## 디자인 작업 규칙 (중요)

디자인 관련 결정·변경은 **항상 `DESIGN.md`에 먼저/함께 기록**한다.

1. 디자인 작업을 시작하기 전에 `DESIGN.md` 전체를 읽는다
2. 사용자가 디자인 관련 요청(색·폰트·레이아웃·간격·컴포넌트 등)을 하면
3. `DESIGN.md`의 해당 항목을 업데이트하고 (없으면 추가)
4. 하단 "결정 로그"에 한 줄 남긴 뒤
5. 코드(`index.html` 등)에 반영한다

새 페이지·새 컴포넌트도 `DESIGN.md`의 무드, 토큰, 반응형 규칙, 금지 요소, 체크리스트를 그대로 따른다.

→ `DESIGN.md`와 실제 코드는 항상 일치해야 한다.

## 코드 스타일

- 컴포넌트는 화면 책임별로 작게 나누고, 콘텐츠는 `src/data/`에서 관리
- 컬러·폰트는 `src/styles.css`의 `:root` CSS 변수로만 관리 (하드코딩 금지)
- 새 페이지와 컴포넌트는 기존 디자인 토큰을 재사용해 일관성 유지
