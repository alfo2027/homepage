# Unified Portfolio Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Make the homepage, project details, and future routes inherit one visual system and preserve the selected light/dark theme during in-app navigation.

**Architecture:** A focused PortfolioTheme provider owns the session theme and renders the common application root. Global semantic CSS tokens live on that root; legacy variables alias them during migration. The homepage consumes the shared theme instead of local state, while project details inherit the same colors, type scale, spacing, and motion without altering portfolio images.

**Tech Stack:** React, React Context, React Router, CSS custom properties, Vitest, Testing Library

**Spec:** docs/superpowers/specs/2026-09-04-unified-portfolio-design-system.md

**Execution status:** Completed and verified on 2026-09-04.

## Global Constraints

- Light colors: background #f7f7f5, foreground #121212, muted #777, line #d9d9d5.
- Dark colors: background #101010, foreground #f0f0ec, muted #999, line #353535.
- Typography uses Pretendard and the 13px, 15px, and 17px scale for standard UI.
- Spacing uses 10px as the base with 20px, 40px, and 80px hierarchy steps.
- Theme persists only during the current React app session; no browser storage.
- Project images keep their original colors and proportions.

---

### Task 1: Shared theme provider

**Files:**
- Create: src/components/PortfolioTheme.jsx
- Create: src/components/PortfolioTheme.test.jsx
- Modify: src/App.jsx

**Interfaces:**
- Produces: PortfolioThemeProvider({ children })
- Produces: usePortfolioTheme() returning { dark: boolean, toggleTheme: () => void }

- [ ] **Step 1: Write the failing provider test**

Render PortfolioThemeProvider with a consumer button. Assert the root has class portfolio-app, starts without is-dark, toggles is-dark, and exposes the new context API.

- [ ] **Step 2: Run the provider test and confirm failure**

Run: npm test -- --run src/components/PortfolioTheme.test.jsx

Expected: FAIL because PortfolioTheme does not exist.

- [ ] **Step 3: Implement the provider**

Create a context with dark state, a toggleTheme callback, and a portfolio-app root whose class becomes portfolio-app is-dark. Throw a clear error when usePortfolioTheme is called outside the provider.

- [ ] **Step 4: Wrap the application**

In App.jsx, place PortfolioThemeProvider inside HashRouter and outside ProjectTransitionProvider so all routes share one theme instance.

- [ ] **Step 5: Run focused tests**

Run: npm test -- --run src/components/PortfolioTheme.test.jsx src/App.test.jsx

Expected: PASS.

### Task 2: Connect homepage theme control

**Files:**
- Modify: src/pages/CaiConceptPage.jsx
- Modify: src/pages/CaiConceptPage.test.jsx

**Interfaces:**
- Consumes: usePortfolioTheme() from Task 1.
- Preserves: existing theme button accessible names and InteractiveOrb dark prop.

- [ ] **Step 1: Write the failing homepage integration test**

Render CaiConceptPage inside PortfolioThemeProvider and its existing router providers. Click the dark-mode button and assert the shared portfolio-app root becomes is-dark while the homepage reflects the same state.

- [ ] **Step 2: Run the focused test and confirm failure**

Run: npm test -- --run src/pages/CaiConceptPage.test.jsx

Expected: FAIL because the page still owns local dark state.

- [ ] **Step 3: Replace local state with shared context**

Remove the local dark useState declaration. Read dark and toggleTheme from usePortfolioTheme, keep the current label logic, and call toggleTheme from the dot button.

- [ ] **Step 4: Run focused tests**

Run: npm test -- --run src/pages/CaiConceptPage.test.jsx src/App.test.jsx

Expected: PASS.

### Task 3: Global tokens and project detail styling

**Files:**
- Modify: src/styles.css
- Modify: src/concepts/cai.css
- Modify: src/pages/ProjectPage.test.jsx
- Modify: DESIGN.md

**Interfaces:**
- Consumes: portfolio-app and portfolio-app is-dark classes from Task 1.
- Produces: semantic tokens --portfolio-bg, --portfolio-fg, --portfolio-muted, --portfolio-line, --portfolio-type-13, --portfolio-type-15, --portfolio-type-17, --portfolio-space-1, --portfolio-space-2, --portfolio-space-4, --portfolio-space-8.

- [ ] **Step 1: Write failing project detail style assertions**

Wrap the project route test helper in PortfolioThemeProvider. Assert project-shell background equals #f7f7f5 through the shared token, body and detail use Pretendard, intro title is 17px, intro narrative is 13px, related titles are 15px, and related types are 13px.

- [ ] **Step 2: Run the project test and confirm failure**

Run: npm test -- --run src/pages/ProjectPage.test.jsx

Expected: FAIL on the old white background and 18px/14px/17px/14px detail typography.

- [ ] **Step 3: Define shared application tokens**

Move the approved light and dark values to portfolio-app. Set its minimum height, background, foreground, font, line-height, and transitions. Alias --bg, --fg, --muted, --line and --cai-* to the shared semantic tokens.

- [ ] **Step 4: Migrate homepage and detail selectors**

Make cai-concept transparent to the shared root while retaining layout variables. Give project-shell the shared background and foreground. Update detail intro and related-card typography to 17px/13px and 15px/13px. Use shared spacing tokens where values are 10px, 20px, 40px, or 80px. Do not apply filters or opacity to project detail images.

- [ ] **Step 5: Update design documentation**

Change DESIGN.md's canonical colors, type scale, spacing, theme behavior, homepage menu naming, and project-detail rules so the top-level current rules match the implemented system.

- [ ] **Step 6: Run focused tests**

Run: npm test -- --run src/pages/ProjectPage.test.jsx src/pages/CaiConceptPage.test.jsx

Expected: PASS.

### Task 4: Route-level theme persistence and verification

**Files:**
- Modify: src/App.test.jsx

**Interfaces:**
- Consumes: PortfolioThemeProvider and current project transition routing.

- [ ] **Step 1: Write the failing route persistence test**

At the home route, click the dark-mode button, navigate through a project link with reduced motion enabled for immediate routing, and assert the project-shell remains inside portfolio-app is-dark with the dark computed background.

- [ ] **Step 2: Run the app test and confirm failure**

Run: npm test -- --run src/App.test.jsx

Expected: FAIL until shared theme ownership and detail token inheritance work together.

- [ ] **Step 3: Make the minimal integration corrections**

Fix only provider placement, route wrappers, or selectors revealed by the test. Do not add local storage or page-specific theme state.

- [ ] **Step 4: Run complete automated verification**

Run: npm test -- --run --maxWorkers=1

Expected: all tests pass.

Run: npm run build

Expected: production build succeeds.

Run: git diff --check

Expected: no output.

- [ ] **Step 5: Perform visual verification**

Check homepage and one project detail at desktop and mobile widths in light and dark themes. Confirm matching backgrounds, readable navigation and intro text, unchanged image colors, and preserved theme during navigation.

- [ ] **Step 6: Commit implementation**

Stage only the files listed by this plan and commit with:

git commit -m "feat: unify portfolio visual system"
