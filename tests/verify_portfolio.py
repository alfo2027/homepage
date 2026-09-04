import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class SpaPortfolioTest(unittest.TestCase):
    def read(self, path):
        return (ROOT / path).read_text(encoding="utf-8")

    def test_vite_entry_and_base_path(self):
        index = self.read("index.html")
        vite = self.read("vite.config.js")
        self.assertIn('<div id="root"></div>', index)
        self.assertIn('src="/src/main.jsx"', index)
        self.assertIn('base: "/homepage/"', vite)
        self.assertIn("<title>윤미래 Product Designer</title>", index)

    def test_hash_router_and_required_routes(self):
        app = self.read("src/App.jsx")
        self.assertIn("HashRouter", app)
        self.assertIn('path="/"', app)
        self.assertIn('path="/projects/:slug"', app)
        self.assertIn('path="*"', app)

    def test_legacy_html_pages_are_removed(self):
        legacy = [ROOT / f"project-{number:02}.html" for number in range(1, 12)]
        legacy += [
            ROOT / "project.html",
            ROOT / "concepts.html",
            ROOT / "concept-bold.html",
            ROOT / "concept-minimal.html",
            ROOT / "concept-immersive.html",
        ]
        self.assertEqual([path.name for path in legacy if path.exists()], [])

    def test_project_data_references_existing_avif_assets(self):
        source = self.read("src/data/projects.js")
        referenced = set(re.findall(r'assets/(project-\d{2}/project-\d{2}-(?:thumb|\d{2})\.avif)', source))
        self.assertEqual(len(referenced), 12)
        for relative in referenced:
            self.assertTrue((ROOT / "public" / "assets" / relative).is_file(), relative)
        self.assertNotRegex(source, r'\.(?:png|jpe?g|webp)["\']')

    def test_all_react_images_disable_dragging(self):
        jsx = "\n".join(path.read_text(encoding="utf-8") for path in (ROOT / "src").rglob("*.jsx"))
        self.assertEqual(jsx.count("<img"), jsx.count("draggable={false}"))
        self.assertGreater(jsx.count("<img"), 0)

    def test_design_tokens_and_responsive_gutters_are_preserved(self):
        css = re.sub(r"\s+", "", self.read("src/styles.css"))
        for token in (
            "--portfolio-bg:#f7f7f5",
            "--portfolio-surface:#eeeeeb",
            "--portfolio-fg:#121212",
            "--portfolio-muted:#777",
            "--portfolio-line:#d9d9d5",
            "--bg:var(--portfolio-bg)",
            "--surface:var(--portfolio-surface)",
            "--fg:var(--portfolio-fg)",
            "--muted:var(--portfolio-muted)",
            "--line:var(--portfolio-line)",
        ):
            self.assertIn(token, css)
        self.assertIn("--page-gutter:80px", css)
        self.assertIn("--page-gutter:48px", css)
        self.assertIn("--page-gutter:16px", css)
        self.assertIn("--project-image-max:1920px", css)

    def test_pages_workflow_builds_and_deploys_dist(self):
        workflow = self.read(".github/workflows/deploy-pages.yml")
        for expected in ("npm ci", "npm test -- --run", "npm run build", "path: dist", "actions/deploy-pages"):
            self.assertIn(expected, workflow)

    def test_nojekyll_is_copied_into_build(self):
        self.assertTrue((ROOT / "public" / ".nojekyll").is_file())


if __name__ == "__main__":
    unittest.main()
