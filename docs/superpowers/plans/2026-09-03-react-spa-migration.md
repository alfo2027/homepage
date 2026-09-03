# React SPA Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 정적 포트폴리오를 디자인과 콘텐츠 손실 없이 React hash-routing SPA로 전환하고 GitHub Pages에 배포한다.

**Architecture:** Vite가 하나의 `index.html`을 빌드하고 React Router `HashRouter`가 홈과 프로젝트 상세를 전환한다. 프로젝트·경력 정보는 데이터 모듈에 모으며 홈과 상세 컴포넌트가 같은 데이터를 소비한다.

**Tech Stack:** React, React Router, Vite, Vitest, Testing Library, GitHub Actions Pages

**Spec:** `docs/superpowers/specs/2026-09-03-react-spa-migration-design.md`

## Global Constraints

- React와 Vite를 사용한다.
- 상세 경로는 `/#/projects/{slug}` 형식이다.
- 기존 디자인, 콘텐츠, 프로젝트 순서와 AVIF 자산을 유지한다.
- 기존 `project-01.html`부터 `project-11.html`까지는 제거한다.
- 모든 이미지에 `draggable={false}`를 적용한다.
- Vite `base`는 `/homepage/`이다.
- 공개 상세 이미지 너비 상한은 1920px이다.

---

### Task 1: Vite와 테스트 기반 구성

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/test/setup.js`
- Create: `src/App.test.jsx`
- Modify: `index.html`

**Interfaces:**
- Produces: Vite entry `src/main.jsx`, root component `App`

- [ ] **Step 1: 최소 홈 렌더링 실패 테스트 작성**

```jsx
render(<App />)
expect(screen.getByRole('heading', { name: /디자이너 윤미래/ })).toBeInTheDocument()
```

- [ ] **Step 2: `npm test -- --run`으로 테스트가 설정 또는 컴포넌트 부재로 실패하는지 확인**
- [ ] **Step 3: React/Vite/Vitest 설정과 최소 앱 셸 구현**
- [ ] **Step 4: 테스트와 `npm run build` 통과 확인**
- [ ] **Step 5: 기반 구성 커밋**

### Task 2: 프로젝트·경력 데이터 이전

**Files:**
- Create: `src/data/projects.js`
- Create: `src/data/experience.js`
- Create: `src/data/projects.test.js`

**Interfaces:**
- Produces: `projects: Project[]`, `detailProjects: Project[]`, `experiences: Experience[]`, `getProjectBySlug(slug)`
- `Project`: `{ slug, title, type, thumbnail, thumbnailAlt, upcoming, detailLabel?, images? }`
- `Experience`: `{ company, period, description, projects: { title, items[] }[] }`

- [ ] **Step 1: 프로젝트 12개, 상세 11개, 고유 slug, 이미지 목록을 검증하는 실패 테스트 작성**
- [ ] **Step 2: 테스트 실패 확인**
- [ ] **Step 3: 현재 HTML의 프로젝트·경력 콘텐츠와 이미지 메타데이터를 데이터 모듈로 정확히 이전**
- [ ] **Step 4: 데이터 테스트 통과 확인**
- [ ] **Step 5: 데이터 이전 커밋**

### Task 3: 홈 화면 컴포넌트 이전

**Files:**
- Create: `src/pages/HomePage.jsx`
- Create: `src/components/SiteNavigation.jsx`
- Create: `src/components/Hero.jsx`
- Create: `src/components/Projects.jsx`
- Create: `src/components/ProjectCard.jsx`
- Create: `src/components/Experience.jsx`
- Create: `src/components/Contact.jsx`
- Create: `src/pages/HomePage.test.jsx`
- Create: `src/styles.css`
- Modify: `src/App.jsx`
- Modify: `DESIGN.md`

**Interfaces:**
- Consumes: `projects`, `experiences`
- Produces: `HomePage`, hash 경로 기반 섹션 이동 링크

- [ ] **Step 1: 홈 콘텐츠, 12개 카드, UPCOMING 비활성, 4개 경력 아코디언을 검증하는 실패 테스트 작성**
- [ ] **Step 2: 테스트 실패 확인**
- [ ] **Step 3: 기존 HTML의 홈 마크업과 스타일을 책임별 React 컴포넌트로 이전**
- [ ] **Step 4: 인라인/플로팅 GNB 전환과 홈 섹션 스크롤 구현**
- [ ] **Step 5: 모든 홈 이미지의 `draggable=false` 및 링크 속성 검증**
- [ ] **Step 6: 테스트와 빌드 통과 확인**
- [ ] **Step 7: SPA 컴포넌트 원칙을 `DESIGN.md`와 `AGENT.md`에 반영하고 커밋**

### Task 4: 프로젝트 상세 라우트 이전

**Files:**
- Create: `src/pages/ProjectPage.jsx`
- Create: `src/pages/NotFoundPage.jsx`
- Create: `src/components/ProjectNavigation.jsx`
- Create: `src/components/ScrollToTop.jsx`
- Create: `src/pages/ProjectPage.test.jsx`
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `getProjectBySlug`, `detailProjects`
- Produces: `/projects/:slug`, fallback `*`, 이전/다음 순환 탐색

- [ ] **Step 1: 상세 이미지, 문서 제목, 이전/다음, 잘못된 slug를 검증하는 실패 테스트 작성**
- [ ] **Step 2: 테스트 실패 확인**
- [ ] **Step 3: 단일 상세 컴포넌트와 프로젝트 조회 구현**
- [ ] **Step 4: 목록으로 내비게이션, 플로팅 전환, 경로 변경 스크롤 처리 구현**
- [ ] **Step 5: 이미지 1920px 상한, 무간격 연결, 로딩 우선순위와 draggable 속성 구현**
- [ ] **Step 6: 전체 테스트와 빌드 통과 확인**
- [ ] **Step 7: 상세 라우팅 커밋**

### Task 5: 정적 중복 제거와 Pages 자동 배포

**Files:**
- Delete: `project.html`
- Delete: `project-01.html` through `project-11.html`
- Delete: `concepts.html`
- Delete: `concept-bold.html`
- Delete: `concept-minimal.html`
- Delete: `concept-immersive.html`
- Replace: `tests/verify_portfolio.py`
- Create: `.github/workflows/deploy-pages.yml`
- Create: `public/.nojekyll`

**Interfaces:**
- Consumes: `npm test`, `npm run build`
- Produces: `dist/` Pages artifact

- [ ] **Step 1: SPA 파일 구조와 빌드 산출물을 검증하도록 정적 검증 테스트 갱신**
- [ ] **Step 2: 기존 중복 HTML이 남아 테스트가 실패하는지 확인**
- [ ] **Step 3: 기존 상세·시안 HTML 제거**
- [ ] **Step 4: Node 설치, 테스트, 빌드, Pages artifact 업로드·배포 워크플로 작성**
- [ ] **Step 5: Python 검증, React 테스트, 빌드 전부 통과 확인**
- [ ] **Step 6: 배포 구성 커밋**

### Task 6: 최종 브라우저 검증과 배포

**Files:**
- Modify if needed: React source, tests, deployment workflow

**Interfaces:**
- Produces: `https://alfo2027.github.io/homepage/`의 배포된 SPA

- [ ] **Step 1: 로컬 production preview에서 데스크톱·모바일 홈과 상세를 확인**
- [ ] **Step 2: 홈 GNB, 프로젝트 카드, 경력 아코디언, 연락 링크를 확인**
- [ ] **Step 3: hash 상세 직접 접근, 새로고침, 목록으로, 이전/다음을 확인**
- [ ] **Step 4: `git diff --check`, 테스트, 빌드를 새로 실행**
- [ ] **Step 5: 변경사항을 최종 커밋하고 `main`에 push**
- [ ] **Step 6: GitHub Pages workflow 성공을 확인**
- [ ] **Step 7: 공개 URL에서 HTTP 200, 홈·상세 제목, 이미지 draggable 속성을 확인**
