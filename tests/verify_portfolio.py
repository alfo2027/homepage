from html.parser import HTMLParser
from pathlib import Path
import re
import struct
import unittest


ROOT = Path(__file__).resolve().parents[1]
PROJECT_PAGES = [ROOT / f"project-{index:02d}.html" for index in range(1, 12)]


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.classes = []
        self.hrefs = []
        self.links = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
        if values.get("class"):
            self.classes.extend(values["class"].split())
        if tag == "a" and values.get("href"):
            self.hrefs.append(values["href"])
            self.links.append(values)


class ProjectCardParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.current_field = None
        self.cards = []
        self.current_card = None

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        classes = values.get("class", "").split()
        if tag == "a" and "project-card" in classes:
            self.current_card = {"title": "", "type": ""}
        if self.current_card is not None and "project-title" in classes:
            self.current_field = "title"
        if self.current_card is not None and "project-type" in classes:
            self.current_field = "type"

    def handle_endtag(self, tag):
        if tag in {"h3", "span"}:
            self.current_field = None
        if tag == "a" and self.current_card is not None:
            self.cards.append(self.current_card)
            self.current_card = None

    def handle_data(self, data):
        if self.current_card is not None and self.current_field:
            self.current_card[self.current_field] += data.strip()


def parse_page(path):
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def css_declarations(source, selector):
    compact = "".join(source.split())
    match = re.search(re.escape(selector) + r"\{([^}]*)\}", compact)
    if not match:
        raise AssertionError(f"Missing CSS selector: {selector}")
    return match.group(1)


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
    def test_pages_use_yoon_mirae_product_designer_titles(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertIn("<title>윤미래 Product Designer</title>", home)
        self.assertIn(
            '<meta name="description" content="UI/UX · 프로덕트 디자이너 윤미래의 포트폴리오">',
            home,
        )
        titles = [
            "크립토 뉴스 분석 AI 애널리스트",
            "블루밍비트 알파",
            "플랜 구매 경험 개선",
            "정기 선적 리포트",
            "디자인 시스템 공통화",
            "스케줄 데모 이용률 증대",
            "디버 파트너스 앱 리디자인",
            "디버 주문 웹 UX 개선",
            "디버 배송 알림톡 UX 개선",
            "디버 회원가입 프로세스 개선",
            "그래픽 디자인 &amp; 3D 비주얼",
        ]
        for path, title in zip(PROJECT_PAGES, titles):
            with self.subTest(path=path.name):
                source = path.read_text(encoding="utf-8")
                self.assertIn(
                    f"<title>윤미래 Product Designer — {title}</title>", source
                )

    def test_all_portfolio_images_are_not_draggable(self):
        image_count = 0
        for path in [ROOT / "index.html", *PROJECT_PAGES]:
            with self.subTest(path=path.name):
                source = path.read_text(encoding="utf-8")
                image_tags = re.findall(r"<img\b[^>]*>", source)
                self.assertTrue(image_tags)
                for image_tag in image_tags:
                    self.assertIn('draggable="false"', image_tag)
                self.assertIn("img{-webkit-user-drag:none}", "".join(source.split()))
                image_count += len(image_tags)
        self.assertEqual(image_count, 98)

    def test_home_has_required_sections_and_project_links(self):
        page = parse_page(ROOT / "index.html")
        self.assertTrue(
            {"about", "experience", "projects", "contact"}.issubset(page.ids)
        )
        for project_page in PROJECT_PAGES:
            self.assertIn(project_page.name, page.hrefs)
        self.assertEqual(page.classes.count("project-card"), 12)

    def test_home_has_experience_and_three_project_types(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertIn('id="experience"', source)
        self.assertEqual(source.count('class="project-type"'), 12)
        self.assertEqual(source.count('class="experience-item"'), 4)
        self.assertIn(
            "grid-template-columns:repeat(3,minmax(0,1fr))", compact
        )
        self.assertIn("Pretendard", source)
        self.assertIn('class="contact-panel"', source)

    def test_project_card_descriptions_match_each_project_domain(self):
        parser = ProjectCardParser()
        parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
        self.assertEqual(
            parser.cards,
            [
                {"title": "크립토 뉴스 분석 AI 애널리스트", "type": "Crypto, AI, 콘텐츠 UX 개편"},
                {"title": "블루밍비트 알파", "type": "LLM Search, B2B Crypto Terminal"},
                {"title": "플랜 구매 경험 개선", "type": "B2B SaaS, 결제 프로세스"},
                {"title": "정기 선적 리포트", "type": "B2B2B 솔루션, 이메일 자동화, 리포트 시스템"},
                {"title": "디자인 시스템 공통화", "type": "디자인 시스템, 컴포넌트 라이브러리"},
                {"title": "스케줄 데모 이용률 증대", "type": "그로스 디자인, 프로모션 UX"},
                {"title": "디버 파트너스 앱 리디자인", "type": "Logistics, 앱 디자인, UX 개편"},
                {"title": "디버 주문 웹 UX 개선", "type": "주문·결제 프로세스, 반응형 웹"},
                {"title": "디버 배송 알림톡 UX 개선", "type": "알림톡 프로세스, 웹뷰"},
                {"title": "디버 회원가입 프로세스 개선", "type": "회원가입·온보딩 프로세스"},
                {"title": "그래픽 디자인 & 3D 비주얼", "type": "광고 배너, 마케팅 그래픽, 3D 비주얼"},
            ],
        )

    def test_project_cards_use_rounded_clean_text_hierarchy_without_years(self):
        page = parse_page(ROOT / "index.html")
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertNotIn("project-year", page.classes)
        self.assertNotIn("section-note", page.classes)
        self.assertNotIn("2023 — Present", source)
        self.assertIn("border-radius:4px", compact)
        self.assertIn("gap:72px20px", compact)
        self.assertIn("padding-top:20px", compact)
        self.assertIn("font-size:1.0625rem", compact)
        project_type = css_declarations(source, ".project-type")
        self.assertIn("font-size:13px", project_type)
        self.assertIn("margin-top:4px", project_type)
        self.assertIn("color:var(--fg)", project_type)

    def test_project_thumbnails_share_a_fixed_filled_frame(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertEqual(source.count('class="project-image-frame"'), 12)
        self.assertIn(".project-image-frame{", compact)
        self.assertIn("aspect-ratio:16/10", compact)
        self.assertIn("overflow:hidden", compact)
        self.assertIn("border-radius:4px", compact)
        self.assertIn(".project-image-frame.project-image{", compact)
        self.assertIn("width:100%;height:100%;object-fit:cover", compact)

    def test_main_sections_share_the_same_responsive_section_title(self):
        page = parse_page(ROOT / "index.html")
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertEqual(page.classes.count("section-label"), 4)
        self.assertNotIn("Selected projects", source)
        self.assertNotIn("[01]", source)
        self.assertIn(">Projects</h2>", source)
        self.assertIn(">Experience</h2>", source)
        self.assertIn(">About</h2>", source)
        self.assertIn("font-size:clamp(2rem,3.333vw,3rem)", compact)

    def test_about_introduces_three_core_strengths_before_projects(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        about_start = source.index('id="about"')
        projects_start = source.index('id="projects"')
        self.assertLess(about_start, projects_start)
        self.assertEqual(source.count('class="about-strength"'), 3)
        self.assertNotIn('class="about-intro"', source)
        self.assertEqual(source.count('class="about-strength-number"'), 3)
        self.assertEqual(source.count('class="about-strength-content"'), 3)
        self.assertEqual(source.count('class="about-strength-title"'), 3)
        self.assertEqual(source.count('class="about-strength-copy"'), 3)
        self.assertIn("데이터 중심 서비스 &amp; LLM AI 검색 구축 경험", source)
        self.assertIn("글로벌 서비스 및 다국어 시스템 대응 경험", source)
        self.assertIn("디자인 시스템 구축 및 AI 기반 생산성 향상", source)
        self.assertIn("텍스트 베리어블(Variables) 기반으로", source)
        self.assertIn("Figma MCP 및 Claude AI를 연동한 디자인 QA", source)
        self.assertNotIn(".about-header::after", source)
        self.assertIn('class="about-divider"', source)
        self.assertIn("grid-column:2", css_declarations(source, ".about-divider"))
        self.assertIn("margin-top:var(--about-divider-space)", css_declarations(source, ".about-divider"))
        self.assertIn("border-bottom:1pxsolidvar(--line)", css_declarations(source, ".about-divider"))
        self.assertIn("padding-top:var(--about-divider-space)", css_declarations(source, ".about-strength:first-child"))
        self.assertIn(".about{--about-divider-space:20px}", compact)
        self.assertNotIn(".about-strength::after", source)
        self.assertNotIn("border", css_declarations(source, ".about-strength"))
        self.assertIn("grid-template-columns:minmax(180px,.7fr)minmax(0,1.3fr)", css_declarations(source, ".about-strength"))
        self.assertIn("gap:8vw", css_declarations(source, ".about-strength"))
        self.assertIn("padding:8px024px", css_declarations(source, ".about-strength"))
        self.assertIn("grid-column:2", css_declarations(source, ".about-strength-content"))
        self.assertIn("gap:0", css_declarations(source, ".about-strength-content"))
        self.assertIn("font-size:20px", css_declarations(source, ".about-strength-title"))
        self.assertIn("margin:0020px", css_declarations(source, ".about-strength-title"))
        self.assertIn("font-size:16px", css_declarations(source, ".about-strength-copy"))
        self.assertIn("font-weight:400", css_declarations(source, ".about-strength-copy"))
        self.assertIn("line-height:1.6", css_declarations(source, ".about-strength-copy"))
        self.assertIn("color:var(--muted)", css_declarations(source, ".about-strength-copy"))
        self.assertIn("color:var(--fg)", css_declarations(source, ".about-strength-title"))
        self.assertIn("word-break:keep-all", compact)
        self.assertIn('class="about-header-content"', source)
        self.assertIn('class="about-introduction"', source)
        self.assertIn("새로운 기술이나 기능을 탐구하는 것을 좋아합니다.<br>", source)
        number_css = css_declarations(source, ".about-strength-number")
        self.assertIn("font-size:14px", number_css)
        self.assertIn("font-weight:500", number_css)
        self.assertIn("margin:008px", number_css)

    def test_main_sections_are_separated_by_spacing_without_lines(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        for selector in (".hero", ".section", ".editorial"):
            with self.subTest(selector=selector):
                self.assertNotIn("border-bottom", css_declarations(source, selector))

    def test_experience_uses_a_compact_accessible_accordion(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertNotIn('class="experience-intro"', source)
        self.assertNotIn("다양한 팀과 협업하며", source)
        self.assertNotIn('class="experience-number"', source)
        self.assertEqual(source.count('<details class="experience-item">'), 4)
        self.assertEqual(source.count('class="experience-summary"'), 4)
        self.assertNotIn('<details class="experience-item" open>', source)
        self.assertIn("블루밍비트(Bloomingbit)", source)
        self.assertIn("2025.09 ~ 2026.05", source)
        self.assertIn("한국경제신문 산하 B2C 크립토 뉴스 플랫폼", source)
        self.assertIn("W1 리텐션 5.4% → 8.17%", source)
        self.assertIn("Figma MCP 연동을 통한 디자인 QA 리포트 자동화 테스트", source)
        self.assertIn("트레드링스(TRADLINX)", source)
        self.assertIn("디버 주문용 웹 2.0 리디자인 및 UX 개선", source)
        self.assertIn("퀵서비스 '빠름' App 화면 기획/디자인", source)
        self.assertIn("2024.04 ~ 2025.08", source)
        self.assertIn("2021.07 ~ 2024.04", source)
        self.assertIn("2020.10 ~ 2021.06", source)
        self.assertNotIn('class="experience-role"', source)
        self.assertNotIn("프로덕트 디자이너 · 프로덕트 팀", source)
        self.assertIn(".experience-summary{position:relative;display:grid", compact)
        self.assertIn(".experience-summary{position:relative;display:grid;grid-template-columns:minmax(0,1fr)auto;gap:20px24px", compact)
        self.assertIn("cursor:pointer;list-style:none", compact)
        self.assertIn(".experience-details{padding:16px032px", compact)
        company_css = css_declarations(source, ".experience-company")
        self.assertIn("font-size:17px", company_css)
        self.assertIn("color:var(--fg)", company_css)
        self.assertIn("font-size:17px", css_declarations(source, ".experience-description"))
        self.assertIn("display:none", css_declarations(source, ".experience-summary::-webkit-details-marker"))
        self.assertIn(".experience-list{border-top:0}", compact)
        self.assertIn(".experience-item{border-bottom:1pxsolidvar(--line)}", compact)
        self.assertIn(".experience-item:last-child{border-bottom:0}", compact)
        self.assertIn(".experience-summary.experience-company{font-size:20px", compact)
        self.assertIn(".experience-summary.experience-period,.experience-summary.experience-description{color:var(--muted);font-size:16px;font-weight:400", compact)
        self.assertNotIn("--strong-muted", compact)
        self.assertIn(".experience-projecth3{margin:004px", compact)
        self.assertIn("font-size:16px;font-weight:500", compact)
        self.assertIn(".experience-projecth3{margin:004px;color:var(--fg)", compact)
        self.assertIn(".experience-projectli{color:var(--muted);font-size:16px;font-weight:400", compact)
        self.assertIn("font-weight:400;line-height:1.6", compact)
        self.assertIn(".experience-projectli+li{margin-top:0}", compact)

    def test_home_uses_refined_monochrome_design_system(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertIn("--bg:#fff", compact)
        self.assertIn("--surface:#f5f5f7", compact)
        self.assertIn("--fg:#1d1d1f", compact)
        self.assertIn("--muted:#6e6e73", compact)
        self.assertIn("--line:#eeeeee", compact)
        self.assertIn(".contact-panel{min-height:400px;padding:clamp(30px,4vw,64px);border-radius:8px", compact)
        self.assertIn("transform:scale(1.015)", compact)
        self.assertIn("background:var(--surface)", compact)
        self.assertNotIn("box-shadow:", compact)

    def test_sections_use_consistent_editorial_spacing_and_hierarchy(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertIn("--section-space:80px", compact)
        self.assertIn("@media(max-width:720px){:root{--page-gutter:16px;--section-space:60px}", compact)
        self.assertIn("letter-spacing:-.055em", compact)
        self.assertIn("grid-template-columns:repeat(3,minmax(0,1fr))", compact)
        self.assertIn("background:var(--surface)", compact)
        self.assertNotIn("class=\"contact-eyebrow\"", source)
        self.assertNotIn("class=\"contact-meta\"", source)
        self.assertIn('href="mailto:alfo2027@naver.com"', source)
        self.assertIn('href="tel:01057045376"', source)
        self.assertIn("010.5704.5376", source)
        self.assertEqual(source.count('class="contact-link"'), 2)
        self.assertIn('<h2 class="section-label">Contact</h2>', source)
        self.assertIn('>alfo2027@naver.com <span aria-hidden="true">↗</span></a>', source)
        self.assertIn('>010.5704.5376 <span aria-hidden="true">↗</span></a>', source)
        self.assertNotIn('class="contact-separator"', source)
        self.assertIn(".contact-panel>.section-label{align-self:start", compact)
        self.assertIn(".contact-link{display:inline-flex;align-items:flex-start", compact)
        self.assertIn(".contact-actions{align-self:end;display:flex;align-items:center;gap:20px", compact)
        self.assertIn("font-size:17px;font-weight:500", compact)
        self.assertNotIn(".contact-panel{min-height:520px", compact)

    def test_navigation_has_right_aligned_menu_without_brand_and_footer_only_top(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertNotIn('class="brand"', source)
        self.assertNotIn("© 2026 YOON", source)
        self.assertEqual(source.count('class="nav-contact" href="#contact">Contact</a>'), 2)
        self.assertIn(".nav-links{margin-left:auto;display:flex;gap:30px;align-items:center", compact)
        self.assertNotIn(".nav-links{position:absolute;left:50%;transform:translateX(-50%)", compact)
        self.assertIn(".nav-contact{margin-left:0", compact)
        self.assertIn('<footer class="footer"><a href="#top">Top</a></footer>', source)
        self.assertIn("justify-content:flex-end", css_declarations(source, ".footer"))

    def test_page_gutter_is_80px_on_desktop_and_responsive(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertIn("--page-gutter:80px", compact)
        self.assertIn("calc(100%-var(--page-gutter)*2)", compact)
        self.assertIn("@media(max-width:1200px){:root{--page-gutter:48px}", compact)
        self.assertIn("@media(max-width:720px){:root{--page-gutter:16px;--section-space:60px}", compact)
        self.assertIn(
            "padding-left:max(var(--page-gutter),calc((100vw-var(--max))/2))",
            compact,
        )

    def test_hero_layout_and_sticky_navigation_match_reference_flow(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        hero_start = source.index('<section class="hero"')
        hero_end = source.index("</section>", source.index('class="hero"'))
        nav_start = source.index('<nav class="site-nav nav-inline"')
        trigger_start = source.index('id="nav-trigger"')
        projects_start = source.index('id="projects"')
        hero_source = source[source.index('class="hero"'):hero_end]
        self.assertIn('class="hero-main"', hero_source)
        self.assertNotIn('class="hero-aside"', hero_source)
        self.assertNotIn('class="pill"', hero_source)
        self.assertIn("안녕하세요.<br>디자이너 윤미래입니다.", hero_source)
        self.assertNotIn("사용자의 맥락을 이해하고", source)
        self.assertIn("justify-content:center", css_declarations(source, ".hero"))
        self.assertIn("align-items:center", css_declarations(source, ".hero"))
        self.assertIn(".heroh1{", compact)
        self.assertIn("text-align:center", compact)
        self.assertIn("line-height:1.3", source)
        self.assertIn(
            "font-size:clamp(3.25rem,5.5vw,6rem)",
            css_declarations(source, ".heroh1"),
        )
        self.assertIn(
            ".heroh1{max-width:none;font-size:clamp(2.1rem,9vw,3rem)}", compact
        )
        self.assertNotIn(".hero h1 span", source)
        self.assertLess(nav_start, trigger_start)
        self.assertLess(trigger_start, hero_start)
        self.assertLess(hero_end, projects_start)

    def test_navigation_uses_inline_and_revealed_fixed_headers(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertEqual(source.count('aria-label="주요 메뉴"'), 2)
        self.assertIn('class="site-nav nav-inline"', source)
        self.assertIn('class="site-nav nav-fixed"', source)
        self.assertIn('id="nav-trigger"', source)
        self.assertIn("IntersectionObserver", source)
        self.assertIn("is-visible", source)
        self.assertIn("aria-hidden", source)

    def test_navigation_changes_from_full_bleed_to_floating_on_scroll(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertIn(".nav-inline{position:relative;width:100vw", compact)
        self.assertIn("margin-left:calc(50%-50vw)", compact)
        self.assertIn(".nav-fixed{position:fixed;top:12px;left:50%", compact)
        self.assertIn("--floating-nav-max:1040px", compact)
        self.assertIn("border-radius:22px", compact)
        self.assertIn("transform:translate(-50%,0)", compact)

    def test_navigation_is_about_projects_experience_contact_without_availability(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        self.assertNotIn("Available for opportunities", source)
        expected_links = (
            '<div class="nav-links"><a href="#about">About</a>'
            '<a href="#projects">Projects</a>'
            '<a href="#experience">Experience</a></div>'
            '<a class="nav-contact" href="#contact">Contact</a>'
        )
        self.assertEqual(source.count(expected_links), 2)

    def test_ai_agent_upcoming_card_is_first_and_not_clickable(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        projects_start = source.index('<section class="section" id="projects">')
        first_existing_link = source.index('href="project-01.html"', projects_start)
        tbd_start = source.index('class="project-card is-tbd"', projects_start)
        tbd_end = source.index('</article>', tbd_start)
        tbd_card = source[tbd_start:tbd_end]
        self.assertLess(tbd_start, first_existing_link)
        self.assertNotIn("href=", tbd_card)
        self.assertIn("AI 에이전트", tbd_card)
        self.assertIn("AI Agent, 커뮤니티", tbd_card)
        self.assertNotIn("대화형 UX", tbd_card)
        self.assertNotIn("UX · TBD", tbd_card)
        self.assertIn('<span class="project-tbd-label">UPCOMING</span>', tbd_card)
        self.assertIn("assets/project-12/project-12-thumb.avif", tbd_card)
        self.assertIn("aria-disabled=\"true\"", tbd_card)
        self.assertIn(".project-card.is-tbd{cursor:default", "".join(source.split()))
        tbd_overlay = css_declarations(source, ".project-card.is-tbd.project-image-frame::after")
        self.assertIn("background:rgba(0,0,0,.32)", tbd_overlay)
        tbd_label = css_declarations(source, ".project-tbd-label")
        self.assertIn("top:50%", tbd_label)
        self.assertIn("left:50%", tbd_label)
        self.assertIn("transform:translate(-50%,-50%)", tbd_label)
        thumbnail = ROOT / "assets/project-12/project-12-thumb.avif"
        self.assertTrue(thumbnail.exists())
        self.assertEqual(avif_dimensions(thumbnail), (1200, 735))

    def test_inline_navigation_hides_after_any_downward_scroll(self):
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        compact = "".join(source.split())
        self.assertIn("window.scrollY>0", compact)
        self.assertIn("inlineNav.classList.toggle('is-hidden'", source)
        self.assertIn(".nav-inline.is-hidden", source)
        self.assertIn("addEventListener('scroll'", source)

    def test_resume_is_linked_once_from_about_as_safe_external_link(self):
        page = parse_page(ROOT / "index.html")
        source = (ROOT / "index.html").read_text(encoding="utf-8")
        resume_url = "https://my.surfit.io/w/948478686"
        resume_links = [link for link in page.links if link["href"] == resume_url]
        self.assertEqual(len(resume_links), 1)
        self.assertEqual(resume_links[0].get("class"), "about-resume-link")
        self.assertNotIn("resume-link-primary", source)
        self.assertNotIn("resume-link-secondary", source)
        self.assertIn("text-decoration:none", css_declarations(source, ".about-resume-link"))
        for link in resume_links:
            self.assertEqual(link.get("target"), "_blank")
            self.assertEqual(link.get("rel"), "noopener noreferrer")
            self.assertIn("새 탭", link.get("aria-label", ""))

    def test_project_pages_have_image_viewer_and_navigation(self):
        for path in PROJECT_PAGES:
            with self.subTest(path=path.name):
                self.assertTrue(path.exists())
                page = parse_page(path)
                self.assertIn("project-images", page.classes)
                self.assertIn("project-pagination", page.classes)
                self.assertTrue(any(href.startswith("index.html") for href in page.hrefs))

    def test_project_images_are_capped_at_1920px_and_centered(self):
        for path in PROJECT_PAGES:
            with self.subTest(path=path.name):
                source = path.read_text(encoding="utf-8")
                compact = "".join(source.split())
                self.assertIn("--project-image-max:1920px", compact)
                self.assertIn(
                    ".project-images.is-full-bleed{width:min(100vw,var(--project-image-max));"
                    "margin-left:50%;transform:translateX(-50%)}",
                    compact,
                )
                self.assertIn("width:100%", css_declarations(source, ".project-imagesimg"))

    def test_project_pages_start_with_images_below_full_width_sticky_back_bar(self):
        for path in PROJECT_PAGES:
            with self.subTest(path=path.name):
                source = path.read_text(encoding="utf-8")
                compact = "".join(source.split())
                self.assertIn("--bg:#fff", compact)
                self.assertNotIn('class="project-header"', source)
                self.assertNotIn('class="project-kicker"', source)
                self.assertNotIn('class="project-meta"', source)
                self.assertNotIn("YOON BONGBONG", source)
                self.assertNotIn("윤봉봉", source)
                self.assertIn(
                    '<nav class="project-nav project-nav-inline" aria-label="프로젝트 목록으로">'
                    '<a class="project-back" href="index.html#projects">'
                    '<svg class="project-chevron project-chevron-left" aria-hidden="true" viewBox="0 0 16 16">'
                    '<path d="M10 3.5 5.5 8l4.5 4.5"/></svg>'
                    '<span>목록으로</span></a></nav><div class="project-nav-trigger" '
                    'aria-hidden="true"></div><section class="project-images',
                    source,
                )
                nav_css = css_declarations(source, ".project-nav-inline")
                self.assertIn("width:100vw", nav_css)
                self.assertIn("margin-left:calc(50%-50vw)", nav_css)
                self.assertIn("border-width:001px", nav_css)
                self.assertIn("border:1pxsolidvar(--line)", css_declarations(source, ".project-nav"))
                back_css = css_declarations(source, ".project-back")
                self.assertIn("color:var(--muted)", back_css)
                self.assertIn("font-weight:500", back_css)
                self.assertIn("fill:none", css_declarations(source, ".project-chevron"))

    def test_project_pages_switch_to_compact_floating_back_button_on_scroll(self):
        for path in PROJECT_PAGES:
            with self.subTest(path=path.name):
                source = path.read_text(encoding="utf-8")
                compact = "".join(source.split())
                self.assertEqual(source.count('aria-label="프로젝트 목록으로"'), 2)
                self.assertIn('class="project-nav project-nav-fixed"', source)
                self.assertIn('class="project-nav project-nav-inline"', source)
                self.assertIn('class="project-nav-trigger"', source)
                fixed_css = css_declarations(source, ".project-nav-fixed")
                self.assertIn("position:fixed", fixed_css)
                self.assertIn("top:12px", fixed_css)
                self.assertIn("width:max-content", fixed_css)
                self.assertIn("border:1pxsolidvar(--line)", fixed_css)
                self.assertIn("border-radius:22px", fixed_css)
                self.assertIn("backdrop-filter:saturate(180%)blur(18px)", css_declarations(source, ".project-nav"))
                self.assertIn(".project-nav-fixed.is-visible", compact)
                self.assertIn("IntersectionObserver", source)
                self.assertIn("window.scrollY>0", compact)
                self.assertIn('inlineNav.classList.toggle("is-hidden"', source)

    def test_project_pages_end_without_image_gap_and_show_adjacent_project_titles(self):
        titles = [
            "크립토 뉴스 분석 AI 애널리스트",
            "블루밍비트 알파",
            "플랜 구매 경험 개선",
            "정기 선적 리포트",
            "디자인 시스템 공통화",
            "스케줄 데모 이용률 증대",
            "디버 파트너스 앱 리디자인",
            "디버 주문 웹 UX 개선",
            "디버 배송 알림톡 UX 개선",
            "디버 회원가입 프로세스 개선",
            "그래픽 디자인 &amp; 3D 비주얼",
        ]
        for index, path in enumerate(PROJECT_PAGES):
            with self.subTest(path=path.name):
                source = path.read_text(encoding="utf-8")
                compact = "".join(source.split())
                previous_index = (index - 1) % len(PROJECT_PAGES)
                next_index = (index + 1) % len(PROJECT_PAGES)
                previous_href = PROJECT_PAGES[previous_index].name
                next_href = PROJECT_PAGES[next_index].name
                self.assertNotIn("padding-bottom:88px", css_declarations(source, ".project-images"))
                self.assertNotIn(">목록</a>", source)
                self.assertIn("grid-template-columns:repeat(2,minmax(0,1fr))", css_declarations(source, ".project-pagination"))
                self.assertIn(
                    f'<a class="project-pagination-link is-previous" href="{previous_href}">'
                    f'<span class="project-pagination-label"><svg class="project-chevron project-chevron-left" '
                    f'aria-hidden="true" viewBox="0 0 16 16"><path d="M10 3.5 5.5 8l4.5 4.5"/></svg>이전</span>'
                    f'<strong class="project-pagination-title">{titles[previous_index]}</strong></a>',
                    source,
                )
                self.assertIn(
                    f'<a class="project-pagination-link is-next" href="{next_href}">'
                    f'<strong class="project-pagination-title">{titles[next_index]}</strong>'
                    f'<span class="project-pagination-label">다음<svg class="project-chevron project-chevron-right" '
                    f'aria-hidden="true" viewBox="0 0 16 16"><path d="m6 3.5 4.5 4.5L6 12.5"/></svg></span></a>',
                    source,
                )
                pagination_link_css = css_declarations(source, ".project-pagination-link")
                self.assertIn("flex-direction:row", pagination_link_css)
                self.assertIn("align-items:center", pagination_link_css)
                self.assertIn("white-space:nowrap", css_declarations(source, ".project-pagination-label"))
                self.assertIn("font-size:15px", css_declarations(source, ".project-pagination-title"))

    def test_single_and_seamless_project_modes_are_supported(self):
        for path in PROJECT_PAGES:
            self.assertTrue(path.exists(), f"{path.name} must exist")
        single = (ROOT / "project.html").read_text(encoding="utf-8")
        second_project = (ROOT / "project-02.html").read_text(encoding="utf-8")
        third_project = (ROOT / "project-03.html").read_text(encoding="utf-8")
        fourth_project = (ROOT / "project-04.html").read_text(encoding="utf-8")
        fifth_project = (ROOT / "project-05.html").read_text(encoding="utf-8")
        sixth_project = (ROOT / "project-06.html").read_text(encoding="utf-8")
        self.assertIn("single-image", single)
        self.assertIn("project-images is-seamless is-full-bleed", second_project)
        self.assertIn("project-images is-seamless is-full-bleed", third_project)
        self.assertIn("project-images is-seamless is-full-bleed", fourth_project)
        self.assertIn("project-images is-seamless is-full-bleed", fifth_project)
        self.assertIn("project-images is-seamless is-full-bleed", sixth_project)

    def test_third_project_uses_plan_purchase_avif_assets(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-03.html").read_text(encoding="utf-8")
        thumbnail = "assets/project-03/project-03-thumb.avif"
        image_paths = [
            f"assets/project-03/project-03-{index:02d}.avif"
            for index in range(1, 10)
        ]
        self.assertTrue((ROOT / thumbnail).exists(), thumbnail)
        self.assertIn(thumbnail, home)
        self.assertIn("플랜 구매 경험 개선", home)
        self.assertIn("<title>윤미래 Product Designer — 플랜 구매 경험 개선</title>", detail)
        for image_path in image_paths:
            self.assertTrue((ROOT / image_path).exists(), image_path)
            self.assertIn(image_path, detail)
            self.assertEqual(avif_dimensions(ROOT / image_path)[0], 3334)
        self.assertEqual(detail.count('<img draggable="false" src="assets/project-03/'), 9)
        self.assertEqual(detail.count('loading="lazy"'), 8)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)
        self.assertIn(".project-imagesimg+img{margin-top:-1px}", "".join(detail.split()))
        self.assertNotIn(".pdf", detail)
        self.assertNotIn(".png", detail)

    def test_fourth_project_uses_shipment_report_avif_assets(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-04.html").read_text(encoding="utf-8")
        thumbnail = "assets/project-04/project-04-thumb.avif"
        image_paths = [
            f"assets/project-04/project-04-{index:02d}.avif"
            for index in range(1, 10)
        ]
        self.assertTrue((ROOT / thumbnail).exists(), thumbnail)
        self.assertIn(thumbnail, home)
        self.assertIn("정기 선적 리포트", home)
        self.assertIn("<title>윤미래 Product Designer — 정기 선적 리포트</title>", detail)
        for image_path in image_paths:
            self.assertTrue((ROOT / image_path).exists(), image_path)
            self.assertIn(image_path, detail)
            self.assertEqual(avif_dimensions(ROOT / image_path)[0], 3334)
        self.assertEqual(detail.count('<img draggable="false" src="assets/project-04/'), 9)
        self.assertEqual(detail.count('loading="lazy"'), 8)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)
        self.assertIn(".project-imagesimg+img{margin-top:-1px}", "".join(detail.split()))
        self.assertNotIn(".pdf", detail)
        self.assertNotIn(".png", detail)

    def test_fifth_project_uses_design_system_avif_assets(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-05.html").read_text(encoding="utf-8")
        thumbnail = "assets/project-05/project-05-thumb.avif"
        image_paths = [
            f"assets/project-05/project-05-{index:02d}.avif"
            for index in range(1, 11)
        ]
        self.assertTrue((ROOT / thumbnail).exists(), thumbnail)
        self.assertIn(thumbnail, home)
        self.assertIn("디자인 시스템 공통화", home)
        self.assertIn("<title>윤미래 Product Designer — 디자인 시스템 공통화</title>", detail)
        for image_path in image_paths:
            self.assertTrue((ROOT / image_path).exists(), image_path)
            self.assertIn(image_path, detail)
            self.assertEqual(avif_dimensions(ROOT / image_path)[0], 3334)
        self.assertEqual(detail.count('<img draggable="false" src="assets/project-05/'), 10)
        self.assertEqual(detail.count('loading="lazy"'), 9)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)
        self.assertIn(".project-imagesimg+img{margin-top:-1px}", "".join(detail.split()))
        self.assertNotIn(".pdf", detail)
        self.assertNotIn(".png", detail)

    def test_sixth_project_uses_schedule_demo_avif_assets(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-06.html").read_text(encoding="utf-8")
        thumbnail = "assets/project-06/project-06-thumb.avif"
        image_paths = [
            f"assets/project-06/project-06-{index:02d}.avif"
            for index in range(1, 7)
        ]
        self.assertTrue((ROOT / thumbnail).exists(), thumbnail)
        self.assertIn(thumbnail, home)
        self.assertIn("스케줄 데모 이용률 증대", home)
        self.assertIn("<title>윤미래 Product Designer — 스케줄 데모 이용률 증대</title>", detail)
        for image_path in image_paths:
            self.assertTrue((ROOT / image_path).exists(), image_path)
            self.assertIn(image_path, detail)
            self.assertEqual(avif_dimensions(ROOT / image_path)[0], 3334)
        self.assertEqual(detail.count('<img draggable="false" src="assets/project-06/'), 6)
        self.assertEqual(detail.count('loading="lazy"'), 5)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)
        self.assertIn(".project-imagesimg+img{margin-top:-1px}", "".join(detail.split()))
        self.assertNotIn(".pdf", detail)
        self.assertNotIn(".png", detail)

    def test_updated_project_covers_preserve_supplied_pdf_ratio(self):
        for project in ("project-03", "project-04", "project-05", "project-06"):
            with self.subTest(project=project):
                cover = ROOT / "assets" / project / f"{project}-01.avif"
                thumbnail = ROOT / "assets" / project / f"{project}-thumb.avif"
                detail = (ROOT / f"{project}.html").read_text(encoding="utf-8")
                home = (ROOT / "index.html").read_text(encoding="utf-8")
                self.assertEqual(avif_dimensions(cover), (3334, 1873))
                self.assertEqual(avif_dimensions(thumbnail), (1200, 674))
                self.assertIn(
                    f'src="assets/{project}/{project}-01.avif"', detail
                )
                self.assertIn('width="3334" height="1873"', detail)
                self.assertIn(
                    f'src="assets/{project}/{project}-thumb.avif"', home
                )

    def test_seventh_project_uses_diver_partners_avif_assets(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-07.html").read_text(encoding="utf-8")
        thumbnail = "assets/project-07/project-07-thumb.avif"
        image_paths = [
            f"assets/project-07/project-07-{index:02d}.avif"
            for index in range(1, 8)
        ]
        self.assertTrue((ROOT / thumbnail).exists(), thumbnail)
        self.assertIn(thumbnail, home)
        self.assertIn("디버 파트너스 앱 리디자인", home)
        self.assertIn("<title>윤미래 Product Designer — 디버 파트너스 앱 리디자인</title>", detail)
        for image_path in image_paths:
            self.assertTrue((ROOT / image_path).exists(), image_path)
            self.assertIn(image_path, detail)
            self.assertEqual(avif_dimensions(ROOT / image_path)[0], 3334)
        self.assertEqual(detail.count('<img draggable="false" src="assets/project-07/'), 7)
        self.assertEqual(detail.count('loading="lazy"'), 6)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)
        self.assertIn(".project-imagesimg+img{margin-top:-1px}", "".join(detail.split()))
        self.assertNotIn(".pdf", detail)
        self.assertNotIn(".png", detail)

    def test_eighth_project_uses_diver_order_web_avif_assets(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-08.html").read_text(encoding="utf-8")
        thumbnail = "assets/project-08/project-08-thumb.avif"
        image_paths = [
            f"assets/project-08/project-08-{index:02d}.avif"
            for index in range(1, 8)
        ]
        self.assertTrue((ROOT / thumbnail).exists(), thumbnail)
        self.assertIn(thumbnail, home)
        self.assertIn("디버 주문 웹 UX 개선", home)
        self.assertIn("<title>윤미래 Product Designer — 디버 주문 웹 UX 개선</title>", detail)
        for image_path in image_paths:
            self.assertTrue((ROOT / image_path).exists(), image_path)
            self.assertIn(image_path, detail)
            self.assertEqual(avif_dimensions(ROOT / image_path)[0], 3334)
        self.assertEqual(detail.count('<img draggable="false" src="assets/project-08/'), 7)
        self.assertEqual(detail.count('loading="lazy"'), 6)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)
        self.assertIn(".project-imagesimg+img{margin-top:-1px}", "".join(detail.split()))
        self.assertNotIn(".pdf", detail)
        self.assertNotIn(".png", detail)

    def test_ninth_project_uses_diver_alimtalk_avif_assets(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-09.html").read_text(encoding="utf-8")
        thumbnail = "assets/project-09/project-09-thumb.avif"
        image_paths = [
            f"assets/project-09/project-09-{index:02d}.avif"
            for index in range(1, 8)
        ]
        self.assertTrue((ROOT / thumbnail).exists(), thumbnail)
        self.assertIn(thumbnail, home)
        self.assertIn("디버 배송 알림톡 UX 개선", home)
        self.assertIn("<title>윤미래 Product Designer — 디버 배송 알림톡 UX 개선</title>", detail)
        for image_path in image_paths:
            self.assertTrue((ROOT / image_path).exists(), image_path)
            self.assertIn(image_path, detail)
            self.assertEqual(avif_dimensions(ROOT / image_path)[0], 3334)
        self.assertEqual(detail.count('<img draggable="false" src="assets/project-09/'), 7)
        self.assertEqual(detail.count('loading="lazy"'), 6)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)
        self.assertIn(".project-imagesimg+img{margin-top:-1px}", "".join(detail.split()))
        self.assertNotIn(".pdf", detail)
        self.assertNotIn(".png", detail)

    def test_tenth_project_uses_diver_signup_avif_assets(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-10.html").read_text(encoding="utf-8")
        thumbnail = "assets/project-10/project-10-thumb.avif"
        image_paths = [
            f"assets/project-10/project-10-{index:02d}.avif"
            for index in range(1, 8)
        ]
        self.assertTrue((ROOT / thumbnail).exists(), thumbnail)
        self.assertIn(thumbnail, home)
        self.assertIn("디버 회원가입 프로세스 개선", home)
        self.assertIn("<title>윤미래 Product Designer — 디버 회원가입 프로세스 개선</title>", detail)
        for image_path in image_paths:
            self.assertTrue((ROOT / image_path).exists(), image_path)
            self.assertIn(image_path, detail)
            self.assertEqual(avif_dimensions(ROOT / image_path)[0], 3334)
        self.assertEqual(detail.count('<img draggable="false" src="assets/project-10/'), 7)
        self.assertEqual(detail.count('loading="lazy"'), 6)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)
        self.assertIn(".project-imagesimg+img{margin-top:-1px}", "".join(detail.split()))
        self.assertNotIn(".pdf", detail)
        self.assertNotIn(".png", detail)

    def test_eleventh_project_uses_graphic_design_avif_assets(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-11.html").read_text(encoding="utf-8")
        thumbnail = "assets/project-11/project-11-thumb.avif"
        image_paths = [
            f"assets/project-11/project-11-{index:02d}.avif"
            for index in range(1, 5)
        ]
        self.assertTrue((ROOT / thumbnail).exists(), thumbnail)
        self.assertIn(thumbnail, home)
        self.assertIn("그래픽 디자인 &amp; 3D 비주얼", home)
        self.assertIn("<title>윤미래 Product Designer — 그래픽 디자인 &amp; 3D 비주얼</title>", detail)
        for image_path in image_paths:
            self.assertTrue((ROOT / image_path).exists(), image_path)
            self.assertIn(image_path, detail)
            self.assertEqual(avif_dimensions(ROOT / image_path)[0], 3334)
        self.assertEqual(detail.count('<img draggable="false" src="assets/project-11/'), 4)
        self.assertEqual(detail.count('loading="lazy"'), 3)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)
        self.assertIn(".project-imagesimg+img{margin-top:-1px}", "".join(detail.split()))
        self.assertNotIn(".pdf", detail)
        self.assertNotIn(".png", detail)

    def test_second_project_uses_bloomingbit_alpha_avif_assets(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-02.html").read_text(encoding="utf-8")
        thumbnail = "assets/project-02/project-02-thumb.avif"
        image_paths = [
            f"assets/project-02/project-02-{index:02d}.avif"
            for index in range(1, 12)
        ]
        self.assertTrue((ROOT / thumbnail).exists(), thumbnail)
        self.assertIn(thumbnail, home)
        self.assertIn("블루밍비트 알파", home)
        self.assertIn("<title>윤미래 Product Designer — 블루밍비트 알파</title>", detail)
        for image_path in image_paths:
            self.assertTrue((ROOT / image_path).exists(), image_path)
            self.assertIn(image_path, detail)
            self.assertEqual(avif_dimensions(ROOT / image_path)[0], 3334)
        self.assertEqual(detail.count('<img draggable="false" src="assets/project-02/'), 11)
        self.assertEqual(detail.count('loading="lazy"'), 10)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)
        self.assertIn(".project-imagesimg+img{margin-top:-1px}", "".join(detail.split()))
        self.assertNotIn(".pdf", detail)
        self.assertNotIn(".png", detail)

    def test_first_project_uses_rendered_pdf_images_without_gaps(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-01.html").read_text(encoding="utf-8")
        thumbnail = "assets/project-01/project-01-thumb.avif"
        image_paths = [
            f"assets/project-01/project-01-{index:02d}.avif"
            for index in range(1, 10)
        ]
        for image_path in image_paths:
            self.assertTrue((ROOT / image_path).exists(), image_path)
            self.assertIn(image_path, detail)
        self.assertTrue((ROOT / thumbnail).exists(), thumbnail)
        self.assertIn(thumbnail, home)
        self.assertIn('class="project-images is-seamless is-full-bleed"', detail)
        self.assertEqual(detail.count('<img draggable="false" src="assets/project-01/'), 9)

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
            image_path = ROOT / f"assets/project-01/project-01-{index:02d}.avif"
            self.assertEqual(avif_dimensions(image_path)[0], 3334)
        self.assertIn(".project-imagesimg+img{margin-top:-1px}", compact)

    def test_first_project_serves_avif_with_intrinsic_dimensions(self):
        home = (ROOT / "index.html").read_text(encoding="utf-8")
        detail = (ROOT / "project-01.html").read_text(encoding="utf-8")
        for index in range(1, 10):
            avif_path = ROOT / f"assets/project-01/project-01-{index:02d}.avif"
            self.assertTrue(avif_path.exists(), avif_path)
            width, height = avif_dimensions(avif_path)
            self.assertIn(
                f'project-01-{index:02d}.avif" alt=', detail
            )
            self.assertIn(f'width="{width}" height="{height}"', detail)
        thumb_width, thumb_height = avif_dimensions(
            ROOT / "assets/project-01/project-01-thumb.avif"
        )
        self.assertEqual(thumb_width, 1200)
        self.assertLessEqual(thumb_height, 4096)
        self.assertIn("project-01-thumb.avif", home)
        self.assertIn('decoding="async"', detail)
        self.assertEqual(detail.count('loading="lazy"'), 8)
        self.assertNotIn(".png", detail)
        self.assertNotIn(".pdf", detail)

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
