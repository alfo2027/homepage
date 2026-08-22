# Small Studio–Inspired Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pretendard를 유지하면서 메인을 대형 타이포, 3열 프로젝트, 번호형 About·Experience, 검은색 Contact 패널의 포트폴리오로 재설계한다.

**Architecture:** `index.html`의 정적 HTML·CSS를 재구성하고 기존 프로젝트 상세 링크를 유지한다. 구조 테스트로 섹션, 카드 메타데이터, 반응형 그리드를 고정한다.

**Tech Stack:** HTML5, CSS3, Pretendard CDN, Python 3 unittest

**Spec:** `docs/superpowers/specs/2026-08-22-small-studio-inspired-redesign.md`

## Global Constraints

- 프레임워크·빌드·JavaScript 의존성을 추가하지 않는다.
- 폰트는 Pretendard만 사용한다.
- 원본 사이트의 문구·로고·이미지를 복제하지 않는다.
- 기존 프로젝트 상세 링크와 이미지 모드를 유지한다.

---

### Task 1: Redesign Contract

**Files:**
- Modify: `tests/verify_portfolio.py`
- Test: `tests/verify_portfolio.py`

**Interfaces:**
- Consumes: `index.html`
- Produces: `experience`, three project types, three-column CSS, Pretendard, contact panel requirements

- [ ] **Step 1: Add failing tests**

```python
def test_home_has_experience_and_three_project_types(self):
    source = (ROOT / "index.html").read_text(encoding="utf-8")
    self.assertIn('id="experience"', source)
    self.assertGreaterEqual(source.count('class="project-type"'), 3)
    self.assertIn("repeat(3,1fr)", compact_css(source))
```

- [ ] **Step 2: Verify RED**

Run: `python3 -m unittest tests.verify_portfolio.PortfolioStructureTest.test_home_has_experience_and_three_project_types -v`

Expected: FAIL because Experience and the 3-column contract are absent.

### Task 2: Main Page Redesign

**Files:**
- Modify: `index.html`
- Test: `tests/verify_portfolio.py`

**Interfaces:**
- Consumes: existing `project-01.html` through `project-03.html`
- Produces: `#projects`, `#about`, `#experience`, `#contact`; `.projects-grid`; `.project-type`; `.experience-row`; `.contact-panel`

- [ ] **Step 1: Build the hero and navigation**

Use a full-width large Korean statement, right supporting copy, black pill CTA, and `About / Experience / Projects / Contact` anchors.

- [ ] **Step 2: Build three-column projects**

```css
.projects-grid { display:grid; grid-template-columns:repeat(3,1fr); }
@media (max-width:1024px) { .projects-grid { grid-template-columns:repeat(2,1fr); } }
@media (max-width:720px) { .projects-grid { grid-template-columns:1fr; } }
```

Each card exposes `.project-title`, `.project-year`, and `.project-type`.

- [ ] **Step 3: Build About and Experience**

Use numbered two-column sections. Each `.experience-row` contains company, role, period, and work summary with sample content clearly marked for replacement.

- [ ] **Step 4: Build contact panel and footer**

Add a rounded black `.contact-panel`, white email pill, and minimal footer.

- [ ] **Step 5: Verify GREEN**

Run: `python3 -m unittest tests/verify_portfolio.py -v`

Expected: all tests PASS.

### Task 3: Visual Verification

**Files:**
- Modify: `index.html` only if rendering reveals a defect

**Interfaces:**
- Consumes: completed static page
- Produces: verified 1440px and 390px views

- [ ] **Step 1: Render desktop and mobile**

Serve on `127.0.0.1` and capture 1440px and 390px full-page screenshots.

- [ ] **Step 2: Check key relationships**

Verify large hero hierarchy, desktop 3-column cards, mobile 1-column cards, readable Experience rows, and responsive contact panel.

- [ ] **Step 3: Run final verification**

Run: `python3 -m unittest tests/verify_portfolio.py -v && git diff --check`

Expected: all tests PASS and no whitespace errors.
