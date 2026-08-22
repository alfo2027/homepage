# Product Designer Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 채용 담당자가 소개와 프로젝트 목록을 확인하고, 피그마 포트폴리오 이미지를 보는 상세 페이지로 이동할 수 있는 정적 사이트를 만든다.

**Architecture:** `index.html`이 소개와 프로젝트 탐색을 담당하고, 프로젝트별 정적 HTML이 같은 Quiet Editorial 상세 틀을 복사해 사용한다. 상세 이미지는 `.project-images`의 자식 `<img>` 수에 상관없이 반응형으로 표시하고 `.is-seamless`로 이미지 간격을 제거한다.

**Tech Stack:** HTML5, CSS3, Pretendard CDN, Python 3 표준 라이브러리 검증 스크립트

**Spec:** `docs/superpowers/specs/2026-08-22-product-designer-portfolio-design.md`

## Global Constraints

- 프레임워크, 빌드, JavaScript 의존성을 추가하지 않는다.
- 각 페이지는 단일 HTML 파일로 유지한다.
- 색상과 폰트 토큰은 `:root` CSS 변수로 관리한다.
- `DESIGN.md`와 실제 디자인을 일치시킨다.
- 모든 사용자 텍스트는 교체하기 쉬운 예시 콘텐츠로 제공한다.

---

### Task 1: Static Structure Verification

**Files:**
- Create: `tests/verify_portfolio.py`
- Test: `tests/verify_portfolio.py`

**Interfaces:**
- Consumes: 프로젝트 루트의 HTML 파일
- Produces: `unittest` 기반의 페이지 구조·링크·이미지 모드 검증

- [ ] **Step 1: Write the failing structural tests**

```python
class PortfolioStructureTest(unittest.TestCase):
    def test_home_has_required_sections_and_project_links(self): ...
    def test_project_pages_have_image_viewer_and_navigation(self): ...
    def test_single_split_and_seamless_modes_are_demonstrated(self): ...
    def test_all_local_html_links_resolve(self): ...
```

- [ ] **Step 2: Run tests and verify they fail**

Run: `python3 -m unittest tests/verify_portfolio.py -v`

Expected: FAIL because `project-01.html`, `project-02.html`, and `project-03.html` do not exist and the home page does not expose the required structure.

- [ ] **Step 3: Commit the failing verification**

```bash
git add tests/verify_portfolio.py
git commit -m "test: define portfolio page contract"
```

### Task 2: Quiet Editorial Home

**Files:**
- Modify: `index.html`
- Test: `tests/verify_portfolio.py`

**Interfaces:**
- Consumes: `--bg`, `--surface`, `--fg`, `--muted`, `--accent`, `--line` design tokens
- Produces: `#about`, `#projects`, `#contact` sections and links to `project-01.html`, `project-02.html`, `project-03.html`

- [ ] **Step 1: Run the home-page contract test and verify it fails**

Run: `python3 -m unittest tests.verify_portfolio.PortfolioStructureTest.test_home_has_required_sections_and_project_links -v`

Expected: FAIL because `#projects` and the three project links are absent.

- [ ] **Step 2: Implement the home structure**

```html
<main>
  <section class="hero">...</section>
  <section id="about">...</section>
  <section id="projects" class="projects">...</section>
  <section id="contact">...</section>
</main>
```

Each project card is an `<a class="project-card" href="project-0N.html">` containing `.project-thumb`, `.project-index`, heading, category, and year. CSS renders two columns and switches to one column at 620px.

- [ ] **Step 3: Run the home-page test**

Run: `python3 -m unittest tests.verify_portfolio.PortfolioStructureTest.test_home_has_required_sections_and_project_links -v`

Expected: PASS.

- [ ] **Step 4: Commit the home page**

```bash
git add index.html
git commit -m "feat: build quiet editorial portfolio home"
```

### Task 3: Flexible Project Image Pages

**Files:**
- Modify: `project.html`
- Create: `project-01.html`
- Create: `project-02.html`
- Create: `project-03.html`
- Test: `tests/verify_portfolio.py`

**Interfaces:**
- Consumes: links from `index.html`
- Produces: `.project-images` for spaced images and `.project-images.is-seamless` for zero-gap split images

- [ ] **Step 1: Run project-page tests and verify they fail**

Run: `python3 -m unittest tests.verify_portfolio.PortfolioStructureTest.test_project_pages_have_image_viewer_and_navigation tests.verify_portfolio.PortfolioStructureTest.test_single_split_and_seamless_modes_are_demonstrated -v`

Expected: FAIL because the three project files do not exist.

- [ ] **Step 2: Implement the reusable detail template**

```html
<main class="project-shell">
  <header class="project-header">...</header>
  <section class="project-images" aria-label="프로젝트 포트폴리오 이미지">...</section>
  <nav class="project-pagination" aria-label="프로젝트 탐색">...</nav>
</main>
```

Use `--image-gap: 24px`; `.project-images.is-seamless { --image-gap: 0px; }`; and `.project-images img { display:block; width:100%; height:auto; }`. Provide a styled `.image-placeholder` plus comments showing the exact replacement `<img>` markup.

- [ ] **Step 3: Create three linked examples**

`project-01.html` demonstrates a single long image slot, `project-02.html` demonstrates multiple spaced slots, and `project-03.html` demonstrates multiple seamless slots. All pages include home, previous, and next links.

- [ ] **Step 4: Run all structural tests**

Run: `python3 -m unittest tests/verify_portfolio.py -v`

Expected: PASS.

- [ ] **Step 5: Commit project pages**

```bash
git add project.html project-01.html project-02.html project-03.html
git commit -m "feat: add flexible project image pages"
```

### Task 4: Browser and Final Verification

**Files:**
- Modify: `DESIGN.md` only if implementation details differ from the recorded system
- Test: `tests/verify_portfolio.py`

**Interfaces:**
- Consumes: completed pages
- Produces: verified desktop and mobile portfolio template

- [ ] **Step 1: Check structural validation**

Run: `python3 -m unittest tests/verify_portfolio.py -v`

Expected: all tests PASS.

- [ ] **Step 2: Serve the site locally**

Run: `python3 -m http.server 8000`

Expected: the portfolio is available at `http://localhost:8000/index.html`.

- [ ] **Step 3: Inspect desktop and mobile views**

Verify at approximately 1440px and 390px widths: hero hierarchy, two-to-one-column card transition, card navigation, responsive image width, and project pagination.

- [ ] **Step 4: Check the final diff**

Run: `git diff --check`

Expected: no whitespace errors.

- [ ] **Step 5: Commit final documentation adjustments if needed**

```bash
git add DESIGN.md
git commit -m "docs: align portfolio design guide"
```
