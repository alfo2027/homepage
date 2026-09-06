import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import CaiConceptPage from "./CaiConceptPage";
import { ProjectTransitionProvider } from "../components/ProjectTransition";
import { PortfolioThemeProvider } from "../components/PortfolioTheme";

vi.mock("../components/InteractiveOrb", () => ({ default: () => <div data-testid="interactive-orb" /> }));

function TestRouter({ children }) {
  return <MemoryRouter><PortfolioThemeProvider><ProjectTransitionProvider>{children}</ProjectTransitionProvider></PortfolioThemeProvider></MemoryRouter>;
}

function getLastMobileRule(selector) {
  return [...document.styleSheets]
    .flatMap((sheet) => [...sheet.cssRules])
    .filter((rule) => rule.conditionText?.replaceAll(" ", "").includes("max-width:640px"))
    .flatMap((rule) => [...rule.cssRules])
    .filter((rule) => rule.selectorText === selector)
    .at(-1);
}

function getCoarsePointerRule(selector) {
  return [...document.styleSheets]
    .flatMap((sheet) => [...sheet.cssRules])
    .filter((rule) => rule.conditionText?.replaceAll(" ", "").includes("(hover:none),(pointer:coarse)"))
    .flatMap((rule) => [...rule.cssRules])
    .find((rule) => rule.selectorText === selector);
}

describe("Cai-inspired concept page", () => {
  test("renders the vertical work index with all navigation in the left sidebar", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });

    expect(screen.getByTestId("cai-concept")).toBeInTheDocument();
    expect(document.title).toBe("Portfolio_Yoon");
    expect(screen.getAllByTestId("cai-project")).toHaveLength(12);
    expect(screen.getByRole("heading", { name: "YOON" })).toBeInTheDocument();
    expect(screen.getByText("책과 전시, 감도 높은 공간과 물건들에서 새로운 영감을 얻습니다.")).toBeInTheDocument();
    expect(screen.getByText("작고 감각적인 것들을 발견해 채우는 즐거움만큼, 깨끗하게 비워진 공간도 좋아합니다.")).toBeInTheDocument();
    expect(screen.getByText("디자인도 그렇습니다. 충분히 들여다본 뒤 꼭 필요한 것만 담아 편안한 경험을 만들려 합니다.")).toBeInTheDocument();
    expect(screen.getByLabelText("프로젝트 세로 목록")).toHaveClass("cai-grid-scroll");
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    const sideMenu = screen.getByRole("navigation", { name: "두 번째 콘셉트 메뉴" });
    expect([...sideMenu.children].map((item) => item.getAttribute("aria-label") ?? item.textContent)).toEqual([
      "Home",
      "About",
    ]);
    expect(screen.queryByRole("link", { name: "Work" })).not.toBeInTheDocument();
    expect(container.querySelector(".cai-side-top > .cai-side-menu")).toBeInTheDocument();
    expect(container.querySelector(".cai-side-right")).not.toBeInTheDocument();
    expect(container.querySelector(".cai-side-top + .cai-profile")).toContainElement(screen.getByRole("heading", { name: "YOON" }));
    expect(container.querySelector(".cai-side-bottom > [data-testid='interactive-orb']")).toBeInTheDocument();
    expect(screen.queryByText(/^\d{2} \/ \d{2}$/)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /모드로 전환/ })).not.toBeInTheDocument();
    const primaryTextColor = getComputedStyle(screen.getByTestId("cai-concept")).color;
    expect(getComputedStyle(screen.getByRole("link", { name: "Home" })).color).toBe(primaryTextColor);
    expect(getComputedStyle(screen.getByRole("link", { name: "About" })).color).toBe(primaryTextColor);
    expect(screen.queryByTestId("custom-cursor")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("cai-project").every((card) => !card.hasAttribute("data-cursor"))).toBe(true);
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("data-cursor");
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute("data-cursor");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.queryByRole("link", { name: "Email" })).not.toBeInTheDocument();
    expect(container.querySelector(".cai-profile-email")).not.toBeInTheDocument();
    expect(getComputedStyle(screen.getByRole("heading", { name: "YOON" })).color).toBe(primaryTextColor);
    expect(container.querySelector(".cai-project-grid")).toHaveClass("is-gallery-index");
    expect(screen.getAllByTestId("cai-project").every((card) => !card.style.transform)).toBe(true);
    expect(screen.getByRole("progressbar", { name: "프로젝트 스크롤 진행률" })).toBeInTheDocument();
    expect(container.querySelector(".cai-scroll-progress-fill")).toHaveStyle({ transform: "scaleY(0)" });
    expect(screen.queryByText("Information")).not.toBeInTheDocument();
    expect(screen.queryByText("Available for thoughtful collaborations.")).not.toBeInTheDocument();
  });

  test("keeps the sidebar navigation free of an active underline", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    const styleRules = [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .map((rule) => rule.cssText)
      .join("\n");

    expect(styleRules).not.toContain('.cai-side-menu a[aria-current="page"]::after');
  });

  test("uses native cursors throughout the page", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    const styleRules = [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .map((rule) => rule.cssText)
      .join("\n");

    expect(styleRules).not.toContain(".cai-cursor");
    expect(styleRules).not.toContain("cursor: grab");
  });

  test("keeps every image non-draggable", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    expect([...container.querySelectorAll("img")].every((image) => image.draggable === false)).toBe(true);
  });

  test("shows project thumbnails in their original colors", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    const firstThumbnail = container.querySelector(".cai-image-wrap img");

    expect(getComputedStyle(firstThumbnail).filter).toBe("none");
    expect(getComputedStyle(firstThumbnail).transform).toBe("none");

    const styleRules = [...document.styleSheets]
      .flatMap((sheet) => [...sheet.cssRules])
      .map((rule) => rule.cssText)
      .join("\n");
    expect(styleRules).toContain("transform: scale(1.03)");
  });

  test("keeps the thumbnail metadata still during hover interactions", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    const projectCopy = container.querySelector(".cai-project-copy");

    expect(getComputedStyle(projectCopy).transition).toBe("none");
    expect(getComputedStyle(projectCopy).transform).toBe("none");
  });

  test("places each detail headline in a centered thumbnail hover overlay", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    const cards = screen.getAllByTestId("cai-project");
    const analystOverlay = cards[1].querySelector(".cai-project-hover");

    const upcomingOverlay = cards[0].querySelector(".cai-project-hover");
    expect(upcomingOverlay).toBeInTheDocument();
    expect(upcomingOverlay).toHaveTextContent("COMING SOON");
    expect(getComputedStyle(upcomingOverlay).opacity).toBe("0");
    expect(cards[0]).toHaveAttribute("tabindex", "0");
    expect(analystOverlay).toBeInTheDocument();
    expect(cards[1].querySelector(".cai-image-wrap")).toContainElement(analystOverlay);
    expect(analystOverlay).toHaveTextContent("크립토 시장을 더 빠르게 이해하는 AI 애널리스트");
    expect(analystOverlay).toHaveAttribute("aria-hidden", "true");
    expect(getComputedStyle(analystOverlay).display).toBe("grid");
    expect(getComputedStyle(analystOverlay).placeItems).toBe("center");
    expect(getComputedStyle(analystOverlay).backgroundColor).toBe("rgba(0, 0, 0, 0.55)");
    expect(getComputedStyle(analystOverlay).backdropFilter).toBe("blur(4px)");
    expect(getComputedStyle(analystOverlay.querySelector("strong")).fontSize).toBe(
      getComputedStyle(cards[1].querySelector(".cai-project-copy h2")).fontSize,
    );
  });

  test("reveals the desktop hover treatment while a project is pressed on touch screens", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });

    expect(getCoarsePointerRule(".cai-image-wrap>.cai-project-hover")?.style.display).toBe("grid");
    expect(getCoarsePointerRule(".cai-project:active .cai-project-hover")?.style.opacity).toBe("1");
    expect(getCoarsePointerRule(".cai-project:active .cai-project-hover strong")?.style.opacity).toBe("1");
    expect(getCoarsePointerRule(".cai-project:active .cai-project-hover strong")?.style.transform).toBe("none");
    expect(getCoarsePointerRule(".cai-project:active img")?.style.transform).toBe("scale(1.03)");
  });

  test("uses the supplied artwork for every matching project thumbnail", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });

    const expectedThumbnails = {
      analyst: "/assets/project-01/project-01-thumb.avif",
      "bloomingbit-alpha": "/assets/project-02/project-02-thumb.avif",
      "plan-purchase": "/assets/project-03/project-03-thumb.avif",
      "shipment-report": "/assets/project-04/project-04-thumb.avif",
      "design-system": "/assets/project-05/project-05-thumb.avif",
      "schedule-demo": "/assets/project-06/project-06-thumb.avif",
      "dever-partners": "/assets/project-07/project-07-thumb.avif",
      "dever-order-web": "/assets/project-08/project-08-thumb.avif",
      "dever-alimtalk": "/assets/project-09/project-09-thumb.avif",
      "dever-signup": "/assets/project-10/project-10-thumb.avif",
      "graphic-visual": "/assets/project-11/project-11-thumb.avif",
    };

    Object.entries(expectedThumbnails).forEach(([slug, thumbnail]) => {
      const card = document.querySelector(`a[href="/projects/${slug}"]`);
      expect(card?.querySelector("img")).toHaveAttribute("src", thumbnail);
    });

    expect(screen.getAllByTestId("cai-project")[0].querySelector("img")).toHaveAttribute(
      "src",
      "/assets/project-12/project-12-thumb.avif",
    );
  });

  test("moves desktop gallery columns at different scroll speeds", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    try {
      render(<CaiConceptPage />, { wrapper: TestRouter });
      const projectList = screen.getByLabelText("프로젝트 세로 목록");
      const cards = screen.getAllByTestId("cai-project");
      Object.defineProperty(projectList, "scrollHeight", { configurable: true, value: 2000 });
      Object.defineProperty(projectList, "clientHeight", { configurable: true, value: 1000 });
      Object.defineProperty(projectList, "scrollTop", { configurable: true, value: 500 });

      fireEvent.scroll(projectList);

      expect(cards[0]).toHaveStyle({ transform: "translate3d(0, -8px, 0)" });
      expect(cards[1]).toHaveStyle({ transform: "translate3d(0, -36px, 0)" });
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  test("recalculates column motion when the gallery crosses the large-monitor breakpoint", () => {
    const originalMatchMedia = window.matchMedia;
    let largeMonitor = false;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(min-width: 1920px)" ? largeMonitor : false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    try {
      render(<CaiConceptPage />, { wrapper: TestRouter });
      const projectList = screen.getByLabelText("프로젝트 세로 목록");
      const cards = screen.getAllByTestId("cai-project");
      Object.defineProperty(projectList, "scrollHeight", { configurable: true, value: 2000 });
      Object.defineProperty(projectList, "clientHeight", { configurable: true, value: 1000 });
      Object.defineProperty(projectList, "scrollTop", { configurable: true, value: 500 });
      largeMonitor = true;

      fireEvent.scroll(projectList);

      expect(cards[0]).toHaveStyle({ transform: "translate3d(0, -9px, 0)" });
      expect(cards[1]).toHaveStyle({ transform: "translate3d(0, -28px, 0)" });
      expect(cards[2]).toHaveStyle({ transform: "translate3d(0, -45px, 0)" });
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  test("uses Pretendard with compact project titles and descriptions", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    const pageStyle = getComputedStyle(screen.getByTestId("cai-concept"));
    const firstProject = screen.getAllByTestId("cai-project")[0];

    expect(pageStyle.fontFamily).toBe("var(--portfolio-font)");
    expect(getComputedStyle(firstProject.querySelector("h2")).fontSize).toBe("var(--portfolio-type-15)");
    expect(getComputedStyle(firstProject.querySelector(".cai-project-copy p")).fontSize).toBe("var(--portfolio-type-13)");

    fireEvent.click(screen.getByRole("link", { name: "About" }));
    expect(getComputedStyle(screen.getByTestId("cai-experience")).fontFamily).toContain("Pretendard");
    expect(getComputedStyle(screen.getByText("블루밍비트(Bloomingbit)")).fontFamily).toContain("Pretendard");
  });

  test("keeps project gaps compact while adding breathing room around the gallery", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    const gridStyle = getComputedStyle(container.querySelector(".cai-project-grid"));

    expect(gridStyle.gap).toBe("var(--portfolio-space-8) var(--portfolio-space-1)");
    expect(gridStyle.padding).toBe("40px");
  });

  test("lets the profile copy use the available sidebar width", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    const profileParagraph = container.querySelector(".cai-profile-copy p");

    expect(getComputedStyle(profileParagraph).maxWidth).toBe("100%");
  });

  test("keeps the profile introduction readable at 14px on mobile", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    const mobileProfileRule = getLastMobileRule(".cai-profile p");

    expect(mobileProfileRule?.style.fontSize).toBe("14px");
  });

  test("keeps the mobile navigation fixed on the page background", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    const mobileNavigationRule = getLastMobileRule(".cai-side-top");

    expect(mobileNavigationRule?.style.position).toBe("fixed");
    expect(mobileNavigationRule?.style.top).toBe("0px");
    expect(mobileNavigationRule?.style.background).toBe("var(--cai-bg)");
    expect(mobileNavigationRule?.style.height).toBe("56px");
    expect(mobileNavigationRule?.style.padding).toBe("0px 20px");
    expect(mobileNavigationRule?.style.borderBottomWidth).toBe("0px");
  });

  test("keeps mobile navigation fully opaque after touch", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    const mobileTouchRule = getLastMobileRule(".cai-side-menu a:hover,.cai-side-menu a:active,.cai-side-menu button:hover,.cai-side-menu button:active");

    expect(mobileTouchRule?.style.opacity).toBe("1");
  });

  test("uses the same 15px size for both mobile navigation links", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    const mobileMenuRule = getLastMobileRule(".cai-side-top>.cai-side-menu");

    expect(mobileMenuRule?.style.fontSize).toBe("15px");
  });

  test("uses consistent 20px horizontal gutters throughout the mobile index", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });

    expect(getLastMobileRule(".cai-side")?.style.padding).toBe("76px 20px 0px");
    expect(getLastMobileRule(".cai-project-grid")?.style.padding).toBe("40px 20px 20px");
    expect(getLastMobileRule(".cai-experience")?.style.paddingLeft).toBe("20px");
    expect(getLastMobileRule(".cai-experience")?.style.paddingRight).toBe("20px");
  });

  test("pairs the mobile profile and character without a full-screen gap", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });

    expect(getLastMobileRule(".cai-side")?.style.display).toBe("grid");
    expect(getLastMobileRule(".cai-side")?.style.gridTemplateColumns).toBe("minmax(0,1fr) 104px");
    expect(getLastMobileRule(".cai-side")?.style.minHeight).toBe("0px");
    expect(getLastMobileRule(".cai-profile")?.style.gridColumn).toBe("1");
    expect(getLastMobileRule(".cai-side-bottom")?.style.gridColumn).toBe("2");
    expect(getLastMobileRule(".cai-side-bottom")?.style.marginBottom).toBe("0px");
    expect(getLastMobileRule(".cai-side-bottom .cai-orb-speech")?.style.width).toBe("max-content");
  });

  test("lets mobile About start below the navigation without the home profile", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });

    fireEvent.click(screen.getByRole("link", { name: "About" }));

    expect(screen.getByTestId("cai-concept")).toHaveClass("is-about");
    expect(getLastMobileRule(".cai-concept.is-about .cai-side")?.style.height).toBe("56px");
    expect(getLastMobileRule(".cai-concept.is-about .cai-profile,.cai-concept.is-about .cai-side-bottom,.cai-concept.is-about .cai-scroll-progress")?.style.display).toBe("none");
    expect(container.querySelector(".cai-experience")).toBeInTheDocument();
  });

  test("adds deliberate line breaks for the wide profile layout", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    const wideBreaks = container.querySelectorAll(".cai-profile-wide-break");

    expect(wideBreaks).toHaveLength(3);
  });

  test("keeps every project thumbnail visible when the mobile page uses document scrolling", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(max-width: 640px)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    const thumbnails = [...container.querySelectorAll(".cai-image-wrap")];
    const projectList = screen.getByLabelText("프로젝트 세로 목록");
    const cards = screen.getAllByTestId("cai-project");
    Object.defineProperty(projectList, "scrollHeight", { configurable: true, value: 2000 });
    Object.defineProperty(projectList, "clientHeight", { configurable: true, value: 1000 });
    Object.defineProperty(projectList, "scrollTop", { configurable: true, value: 500 });
    fireEvent.scroll(projectList);

    expect(thumbnails).toHaveLength(12);
    expect(thumbnails.every((thumbnail) => thumbnail.style.opacity !== "0" && thumbnail.style.visibility !== "hidden")).toBe(true);
    expect(cards.every((card) => !card.style.transform)).toBe(true);
    window.matchMedia = originalMatchMedia;
  });
  test("scrolls the project area to the top when Home is clicked", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    const projectList = screen.getByLabelText("프로젝트 세로 목록");
    projectList.scrollTo = vi.fn();
    const pageScroll = vi.spyOn(window, "scrollTo").mockImplementation(() => {});

    fireEvent.click(screen.getByRole("link", { name: "Home" }));

    expect(projectList.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    expect(pageScroll).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  test("changes only the right area to the About view", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });

    fireEvent.click(screen.getByRole("link", { name: "About" }));

    expect(screen.getByTestId("interactive-orb")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "About" })).not.toBeInTheDocument();
    expect(screen.queryByText("PROFILE / EXPERIENCE")).not.toBeInTheDocument();
    expect(screen.queryByText("데이터 중심 서비스 & LLM AI 검색 구축 경험")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "복잡함을 이해하기 쉬운 경험으로 바꿉니다." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "제품과 협업이 함께 확장되는 체계를 만듭니다." })).toBeInTheDocument();
    expect(screen.getByText(/LLM 기반 대화형 AI 검색 및 리서치 인터페이스를 구축한 경험/)).toBeInTheDocument();
    expect(screen.getByText("블루밍비트(Bloomingbit)")).toBeInTheDocument();
    expect(document.querySelector(".cai-experience-header")).not.toBeInTheDocument();
    expect(document.querySelector(".cai-experience-strengths")).not.toBeInTheDocument();
    expect(screen.queryAllByTestId("cai-project")).toHaveLength(0);
  });

  test("keeps career project details collapsed until each company is opened", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    fireEvent.click(screen.getByRole("link", { name: "About" }));

    const careers = [...document.querySelectorAll(".cai-career-item")];
    expect(careers).toHaveLength(4);
    expect(careers.every((career) => career.tagName === "DETAILS" && !career.hasAttribute("open"))).toBe(true);
    expect(screen.queryByText("*Experience")).not.toBeInTheDocument();
    expect(careers[0].querySelector("summary")).toHaveTextContent("블루밍비트(Bloomingbit)");
    expect(careers[0].querySelector("summary")).toHaveTextContent("2025.09 - 2026.05");
    const firstHeading = careers[0].querySelector(".cai-career-heading");
    const firstTitleRow = firstHeading.querySelector(".cai-career-title-row");
    expect(firstTitleRow).toHaveTextContent("블루밍비트(Bloomingbit)2025.09 - 2026.05");
    expect(firstHeading.querySelector(".cai-career-description")).toBeInTheDocument();
    expect(firstTitleRow.querySelector(".cai-career-chevron")).toBeInTheDocument();
    expect(careers[0].querySelector(".cai-career-chevron").tagName).toBe("svg");
    expect(getComputedStyle(careers[0].querySelector(".cai-career-chevron")).width).toBe("10px");
    expect(getComputedStyle(careers[0].querySelector(".cai-career-chevron")).opacity).toBe("0.5");

    fireEvent.click(careers[0].querySelector("summary"));
    expect(careers[0]).toHaveAttribute("open");
    expect(careers[0]).toHaveTextContent("뉴스 플랫폼 AI 기능 도입 및 퍼널 개선");
    const projects = careers[0].querySelector(".cai-career-projects");
    expect(getComputedStyle(projects.querySelector("h4")).fontSize).toBe("14px");
    expect(getComputedStyle(projects.querySelector("li")).fontSize).toBe("13px");
    expect(getComputedStyle(projects).borderLeftWidth).toBe("1px");
    expect(getComputedStyle(projects).paddingLeft).toBe("18px");
  });

  test("keeps the About contact links plain and left aligned", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    fireEvent.click(screen.getByRole("link", { name: "About" }));

    const footer = document.querySelector(".cai-experience-footer");
    expect(footer).toHaveTextContent("Resume");
    expect(footer).not.toHaveTextContent("↗");
    expect(getComputedStyle(footer).justifyContent).toBe("flex-start");
    expect(getComputedStyle(footer.querySelector("a")).fontSize).toBe("14px");
  });

  test("uses equal spacing between the About intro, careers, and contact links", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    fireEvent.click(screen.getByRole("link", { name: "About" }));

    const intro = document.querySelector(".cai-experience-intro");
    const footer = document.querySelector(".cai-experience-footer");
    const lastCareer = document.querySelector(".cai-career-item:last-child");
    expect(getComputedStyle(intro).marginBottom).toBe("72px");
    expect(getComputedStyle(footer).paddingTop).toBe("72px");
    expect(getComputedStyle(lastCareer).marginBottom).toBe("0px");
  });

  test("uses a restrained type scale for the About introduction and career list", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    fireEvent.click(screen.getByRole("link", { name: "About" }));

    expect(getComputedStyle(document.querySelector(".cai-experience-intro-title")).fontSize).toBe("20px");
    expect(getComputedStyle(document.querySelector(".cai-experience-intro-copy")).fontSize).toBe("15px");
    expect(getComputedStyle(document.querySelector(".cai-experience-intro-copy")).color).toBe(getComputedStyle(document.querySelector(".cai-experience-intro-title")).color);
    expect(getComputedStyle(document.querySelector(".cai-career-heading h3")).fontSize).toBe("14px");
    expect(getComputedStyle(document.querySelector(".cai-career-heading h3")).marginBottom).toBe("0px");
    expect(getComputedStyle(document.querySelector(".cai-career-period")).fontSize).toBe("14px");
    expect(getComputedStyle(document.querySelector(".cai-career-description")).fontSize).toBe("13px");
  });

  test("scales down About typography and career spacing on mobile", () => {
    const styles = readFileSync("src/concepts/cai.css", "utf8");
    const mobileRules = styles.match(/@media\(max-width:640px\)\{\.cai-side-menu button[\s\S]*?\}\n/)?.[0] ?? "";

    expect(mobileRules).toContain(".cai-experience-intro{gap:24px;margin-bottom:48px}");
    expect(mobileRules).toContain(".cai-experience-intro-title{font-size:20px}");
    expect(mobileRules).toContain(".cai-experience-intro-copy{font-size:14px;line-height:1.65}");
    expect(mobileRules).toContain(".cai-career-item{margin-bottom:20px}");
    expect(mobileRules).toContain(".cai-career-heading h3{font-size:14px}");
    expect(mobileRules).toContain(".cai-career-period{font-size:14px}");
    expect(mobileRules).toContain(".cai-career-description{font-size:14px}");
    expect(mobileRules).toContain(".cai-career-projects h4{font-size:14px}");
    expect(mobileRules).toContain(".cai-career-projects li{font-size:13px}");
    expect(mobileRules).toContain(".cai-experience-footer{padding-top:48px");
  });

  test("opens About directly from a project detail navigation link", () => {
    render(
      <MemoryRouter initialEntries={["/about"]}>
        <PortfolioThemeProvider><ProjectTransitionProvider><CaiConceptPage /></ProjectTransitionProvider></PortfolioThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.queryByRole("heading", { name: "About" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "복잡함을 이해하기 쉬운 경험으로 바꿉니다." })).toBeInTheDocument();
    expect(screen.queryAllByTestId("cai-project")).toHaveLength(0);
  });

  test("returns from About to the project list through Home", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    const rightPanel = screen.getByLabelText("프로젝트 세로 목록");
    rightPanel.scrollTo = vi.fn();

    fireEvent.click(screen.getByRole("link", { name: "About" }));
    fireEvent.click(screen.getByRole("link", { name: "Home" }));

    expect(screen.getAllByTestId("cai-project")).toHaveLength(12);
    expect(rightPanel.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
