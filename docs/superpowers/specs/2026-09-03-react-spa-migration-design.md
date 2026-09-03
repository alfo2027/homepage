# React SPA 전환 설계

## 목표

현재 정적 HTML 포트폴리오를 React 기반 단일 페이지 애플리케이션으로 전환한다. 기존 디자인, 콘텐츠, 프로젝트 순서와 AVIF 자산은 유지하면서 중복된 상세 페이지 코드와 라우팅을 통합한다. GitHub Pages에서 새로고침과 직접 접근이 안정적으로 동작해야 한다.

## 결정 사항

- React 18+와 Vite를 사용한다.
- React Router의 `HashRouter`를 사용한다.
- 홈은 `/#/`, 프로젝트 상세는 `/#/projects/{slug}` 형식으로 제공한다.
- 기존 `project-01.html`부터 `project-11.html`까지의 URL은 유지하거나 리다이렉트하지 않는다.
- 기존 시각 디자인과 콘텐츠는 변경하지 않는다.
- 빌드 산출물은 커밋하지 않고 GitHub Actions가 `dist`를 GitHub Pages에 배포한다.

## 검토한 접근

### 1. Vite + React Router `HashRouter` — 채택

GitHub Pages의 서버 재작성 설정 없이 상세 URL 새로고침이 동작한다. 표준 라우터를 사용하므로 홈 섹션 이동, 상세 이동, 잘못된 경로 처리와 뒤로가기를 명확하게 구현할 수 있다.

### 2. React + 직접 만든 hash 라우터

의존성은 줄지만 경로 파싱, 브라우저 히스토리, 스크롤 복원, 잘못된 경로 처리를 직접 유지해야 한다. 작은 초기 절감보다 유지보수 비용이 커서 채택하지 않는다.

### 3. `BrowserRouter` + 404 우회

깔끔한 URL을 제공하지만 GitHub Pages에서 직접 접근할 때 별도 404 리다이렉트 스크립트가 필요하다. 이번 사이트에서는 URL 모양보다 배포 안정성이 우선이므로 채택하지 않는다.

## 구조

```text
index.html
src/
  main.jsx
  App.jsx
  styles.css
  data/
    projects.js
    experience.js
  components/
    SiteNavigation.jsx
    Hero.jsx
    Projects.jsx
    Experience.jsx
    Contact.jsx
    ProjectCard.jsx
    ProjectNavigation.jsx
  pages/
    HomePage.jsx
    ProjectPage.jsx
    NotFoundPage.jsx
public/
  assets/
.github/workflows/deploy-pages.yml
```

컴포넌트는 화면 책임별로 나눈다. 프로젝트와 경력 콘텐츠는 데이터 파일에 두고 컴포넌트가 이를 렌더링한다. 공통 디자인 토큰과 반응형 규칙은 `styles.css`에서 관리하며 `DESIGN.md`를 시각적 기준으로 유지한다.

## 라우팅과 화면 동작

### 홈

- `/#/`에서 Hero, Projects, Experience, Contact를 현재 순서와 디자인으로 렌더링한다.
- GNB의 섹션 링크는 홈에서 해당 섹션으로 스크롤한다.
- 상세 화면에서 GNB 섹션 링크를 선택하면 홈으로 이동한 뒤 대상 섹션으로 스크롤한다.
- 기존 인라인 GNB와 스크롤 후 플로팅 GNB 전환을 유지한다.

### 프로젝트 상세

- `/#/projects/{slug}`에서 프로젝트 데이터에 따라 이미지 목록과 이전/다음 프로젝트를 렌더링한다.
- 이미지 열은 최대 1920px이며, 이미지 사이는 빈틈 없이 연결한다.
- 상단 `목록으로` 내비게이션과 스크롤 후 플로팅 전환을 유지한다.
- 상세 페이지 제목은 `윤미래 Product Designer - {프로젝트명}`으로 변경한다.
- UPCOMING 상태의 AI 에이전트 카드는 링크를 제공하지 않는다.

### 잘못된 경로

- 존재하지 않는 프로젝트나 경로는 간결한 안내와 홈 이동 링크를 보여준다.
- 오류 화면도 동일한 폰트, 색상, 여백 토큰을 사용한다.

## 데이터 모델

프로젝트 데이터는 다음 필드를 가진다.

- `slug`, `title`, `type`, `thumbnail`, `thumbnailAlt`
- `upcoming`
- 상세가 있는 경우 `images[]`, `detailLabel`

`images[]`에는 경로, 대체 텍스트, 원본 너비·높이, 첫 이미지 우선 로딩 여부를 저장한다. 이전/다음 링크는 상세가 있는 프로젝트 배열 순서로 계산한다.

경력 데이터에는 회사명, 기간, 회사 소개와 세부 프로젝트 제목·항목을 저장한다. 현재 아코디언의 기본 닫힘 상태와 접근 가능한 `details/summary` 동작을 유지한다.

## 접근성 및 이미지 정책

- 모든 이미지에 `draggable={false}`와 의미 있는 `alt`를 적용한다.
- 첫 상세 이미지는 우선 로딩하고 나머지는 지연 로딩한다.
- 키보드 포커스 스타일과 네이티브 아코디언을 유지한다.
- `prefers-reduced-motion`에서 전환 애니메이션을 제거한다.
- 외부 Resume 링크에는 새 탭과 `noopener noreferrer`를 적용한다.

## 스크롤 처리

- 경로가 바뀌면 기본적으로 최상단으로 이동한다.
- 홈 섹션 링크에는 대상 ID를 라우터 state로 전달하고 렌더 후 스크롤한다.
- 브라우저 뒤로가기는 라우터 히스토리를 따르며, 프로젝트 상세의 `목록으로`는 홈 Projects 섹션으로 이동한다.

## 배포

- Vite의 `base`는 GitHub Pages 저장소 경로 `/homepage/`로 설정한다.
- GitHub Actions는 `npm ci`, 테스트, 빌드 후 `dist`를 Pages artifact로 배포한다.
- `main` 브랜치 push 시 자동 배포하며 수동 실행도 지원한다.
- 배포 후 공개 URL의 HTTP 200, 홈 콘텐츠, 상세 라우트, 타이틀과 이미지 속성을 확인한다.

## 테스트

- 프로젝트 데이터 개수, 순서, 슬러그 고유성을 검증한다.
- 홈에 12개 카드가 렌더링되고 UPCOMING 카드가 비활성인지 검증한다.
- 상세 프로젝트의 이미지 수, 이전/다음 링크, 문서 제목을 검증한다.
- 모든 렌더링 이미지의 `draggable=false`를 검증한다.
- 잘못된 경로가 오류 화면으로 이동하는지 검증한다.
- 프로덕션 빌드 성공과 빌드 결과의 핵심 정적 파일을 검증한다.

## 완료 기준

- 기존 홈의 시각 구조와 모든 콘텐츠가 보존된다.
- 11개 프로젝트 상세가 단일 React 상세 컴포넌트로 렌더링된다.
- 새 hash URL에서 직접 접근과 새로고침이 동작한다.
- 기존 개별 프로젝트 HTML은 제거된다.
- 자동화 테스트와 프로덕션 빌드가 통과한다.
- GitHub Pages 배포가 성공하고 공개 사이트에서 검증된다.
