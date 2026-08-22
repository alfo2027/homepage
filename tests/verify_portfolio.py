from html.parser import HTMLParser
from pathlib import Path
import struct
import unittest


ROOT = Path(__file__).resolve().parents[1]
PROJECT_PAGES = [ROOT / f"project-0{index}.html" for index in range(1, 4)]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.classes = []
        self.hrefs = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
        if values.get("class"):
            self.classes.extend(values["class"].split())
        if tag == "a" and values.get("href"):
            self.hrefs.append(values["href"])


def parse_page(path):
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def png_dimensions(path):
    with path.open("rb") as stream:
        header = stream.read(24)
    if header[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"Not a PNG file: {path}")
    return struct.unpack(">II", header[16:24])


def avif_dimensions(path):
    data = path.read_bytes()
    marker = data.find(b"ispe")
    if marker == -1:
        raise ValueError(f"Missing AVIF image dimensions: {path}")
    return struct.unpack(">II", data[marker + 8 : marker + 16])


class PortfolioStructureTest(unittest.TestCase):
    def test_home_has_required_sections_and_project_links(self):
        page = parse_page(ROOT / "index.html")
        self.assertTrue({"about", "projects", "contact"}.issubset(page.ids))
        for project_page in PROJECT_PAGES:
            self.assertIn(project_page.name, page.hrefs)
        self.assertGreaterEqual(page.classes.count("project-card"), 3)

    def test_home_has_experience_and_three_project_types(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertIn('id="experience"', source)
        self.assertGreaterEqual(source.count('class="project-type"'), 3)
        self.assertGreaterEqual(source.count('class="experience-row"'), 3)
        self.assertIn("grid-template-columns:repeat(3,1fr)", compact)
        self.assertIn("Pretendard", source)
        self.assertIn('class="contact-panel"', source)

    def test_hero_layout_and_sticky_navigation_match_reference_flow(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        hero_end = source.index("</section>", source.index('class="hero"'))
        nav_start = source.index('<nav class="site-nav', hero_end)
        projects_start = source.index('id="projects"')
        hero_source = source[source.index('class="hero"'):hero_end]
        self.assertIn('class="hero-main"', hero_source)
        self.assertIn('class="pill"', hero_source)
        self.assertIn('class="hero-aside"', hero_source)
        self.assertLess(hero_end, nav_start)
        self.assertLess(nav_start, projects_start)

    def test_navigation_uses_inline_and_revealed_fixed_headers(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertEqual(source.count('aria-label="주요 메뉴"'), 2)
        self.assertIn('class="site-nav nav-inline"', source)
        self.assertIn('class="site-nav nav-fixed"', source)
        self.assertIn('id="nav-trigger"', source)
        self.assertIn("IntersectionObserver", source)
        self.assertIn("is-visible", source)
        self.assertIn("aria-hidden", source)

    def test_inline_navigation_hides_after_any_downward_scroll(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertIn("window.scrollY>0", compact)
        self.assertIn("inlineNav.classList.toggle('is-hidden'", source)
        self.assertIn(".nav-inline.is-hidden", source)
        self.assertIn("addEventListener('scroll'", source)

    def test_project_pages_have_image_viewer_and_navigation(self):
        for path in PROJECT_PAGES:
            with self.subTest(path=path.name):
                self.assertTrue(path.exists())
                page = parse_page(path)
                self.assertIn("project-images", page.classes)
                self.assertIn("project-pagination", page.classes)
                self.assertTrue(any(href.startswith("index.html") for href in page.hrefs))

    def test_single_split_and_seamless_modes_are_demonstrated(self):
        for path in PROJECT_PAGES:
            self.assertTrue(path.exists(), f"{path.name} must exist")
        single = (ROOT / "project.html").read_text(encoding="utf-8")
        split = (ROOT / "project-02.html").read_text(encoding="utf-8")
        seamless = (ROOT / "project-03.html").read_text(encoding="utf-8")
        self.assertIn("single-image", single)
        self.assertGreaterEqual(split.count("image-placeholder"), 2)
        self.assertIn("project-images is-seamless", seamless)
        self.assertGreaterEqual(seamless.count("image-placeholder"), 2)

    def test_first_project_uses_rendered_pdf_images_without_gaps(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-01.html").read_text(encoding="utf-8")
        image_paths = [f"assets/project-01/project-01-{index}.avif" for index in range(1, 10)]
        for image_path in image_paths:
            self.assertTrue((ROOT / image_path).exists(), image_path)
            self.assertIn(image_path, detail)
        self.assertIn(image_paths[0], home)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)
        self.assertEqual(detail.count('<img src="assets/project-01/'), 9)

    def test_first_project_images_fill_the_viewport_width(self):
        detail = (ROOT / "project-01.html").read_text(encoding="utf-8")
        compact = "".join(detail.split())
        self.assertIn(".project-images.is-full-bleed", compact)
        self.assertIn("width:100vw", compact)
        self.assertIn("margin-left:calc(50%-50vw)", compact)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)

    def test_first_project_images_are_retina_ready_and_overlap_seams(self):
        detail = (ROOT / "project-01.html").read_text(encoding="utf-8")
        compact = "".join(detail.split())
        for index in range(1, 10):
            width, _ = png_dimensions(
                ROOT / f"assets/project-01/project-01-{index}.png"
            )
            self.assertGreaterEqual(width, 3000)
        self.assertIn(".project-imagesimg+img{margin-top:-1px}", compact)

    def test_first_project_serves_smaller_retina_avif_images(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-01.html").read_text(encoding="utf-8")
        png_total = 0
        avif_total = 0
        for index in range(1, 10):
            png_path = ROOT / f"assets/project-01/project-01-{index}.png"
            avif_path = ROOT / f"assets/project-01/project-01-{index}.avif"
            self.assertTrue(avif_path.exists(), avif_path)
            self.assertEqual(avif_dimensions(avif_path)[0], 3334)
            self.assertIn(f"project-01-{index}.avif", detail)
            png_total += png_path.stat().st_size
            avif_total += avif_path.stat().st_size
        self.assertIn("project-01-1.avif", home)
        self.assertNotIn("assets/project-01/project-01-1.png", home)
        self.assertNotIn(".png", detail)
        self.assertLess(avif_total, png_total * 0.5)

    def test_all_local_html_links_resolve(self):
        pages = [ROOT / "index.html", *PROJECT_PAGES]
        for path in pages:
            if not path.exists():
                continue
            for href in parse_page(path).hrefs:
                target = href.split("#", 1)[0]
                if target and target.endswith(".html"):
                    with self.subTest(source=path.name, target=target):
                        self.assertTrue((ROOT / target).exists())


if __name__ == "__main__":
    unittest.main()
