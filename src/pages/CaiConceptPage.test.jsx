import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import CaiConceptPage from "./CaiConceptPage";
import { ProjectTransitionProvider } from "../components/ProjectTransition";
import { PortfolioThemeProvider } from "../components/PortfolioTheme";

vi.mock("../components/InteractiveOrb", () => ({ default: () => <div data-testid="interactive-orb" /> }));

function TestRouter({ children }) {
  return <MemoryRouter><PortfolioThemeProvider><ProjectTransitionProvider>{children}</ProjectTransitionProvider></PortfolioThemeProvider></MemoryRouter>;
}

describe("Cai-inspired concept page", () => {
  test("renders the vertical work index with all navigation in the left sidebar", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });

    expect(screen.getByTestId("cai-concept")).toBeInTheDocument();
    expect(document.title).toBe("윤미래 Product Designer");
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
      "다크 모드로 전환",
    ]);
    expect(screen.queryByRole("link", { name: "Work" })).not.toBeInTheDocument();
    expect(container.querySelector(".cai-side-top > .cai-side-menu")).toBeInTheDocument();
    expect(container.querySelector(".cai-side-right")).not.toBeInTheDocument();
    expect(container.querySelector(".cai-side-top + .cai-profile")).toContainElement(screen.getByRole("heading", { name: "YOON" }));
    expect(container.querySelector(".cai-side-bottom > [data-testid='interactive-orb']")).toBeInTheDocument();
    expect(screen.queryByText(/^\d{2} \/ \d{2}$/)).not.toBeInTheDocument();
    expect(sideMenu).toContainElement(screen.getByRole("button", { name: "다크 모드로 전환" }));
    const primaryTextColor = getComputedStyle(screen.getByRole("heading", { name: "YOON" })).color;
    expect(getComputedStyle(screen.getByRole("link", { name: "Home" })).color).toBe(primaryTextColor);
    expect(getComputedStyle(screen.getByRole("button", { name: "About" })).color).toBe(primaryTextColor);
    expect(getComputedStyle(screen.getByRole("button", { name: "다크 모드로 전환" }).querySelector("span")).width).toBe("8px");
    expect(screen.getByTestId("custom-cursor")).toBeInTheDocument();
    expect(screen.getAllByTestId("cai-project")[0]).not.toHaveAttribute("data-cursor");
    expect(screen.getAllByTestId("cai-project")[1]).toHaveAttribute("data-cursor", "project");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("data-cursor", "link");
    expect(screen.getByRole("button", { name: "About" })).toHaveAttribute("data-cursor", "link");
    const emailLink = screen.getByRole("link", { name: "alfo2027@naver.com" });
    expect(emailLink).toHaveAttribute("href", "mailto:alfo2027@naver.com");
    expect(container.querySelector(".cai-profile-copy + .cai-profile-email")).toBe(emailLink);
    expect(emailLink.querySelector("span")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector(".cai-project-grid")).toHaveClass("is-gallery-index");
    expect(screen.getAllByTestId("cai-project").every((card) => !card.style.transform)).toBe(true);
    expect(screen.getByRole("progressbar", { name: "프로젝트 스크롤 진행률" })).toBeInTheDocument();
    expect(container.querySelector(".cai-scroll-progress-fill")).toHaveStyle({ transform: "scaleY(0)" });
    expect(screen.queryByText("Information")).not.toBeInTheDocument();
    expect(screen.queryByText("Available for thoughtful collaborations.")).not.toBeInTheDocument();
  });

  test("switches the gallery between light and dark themes with the dot toggle", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });

    fireEvent.click(screen.getByRole("button", { name: "다크 모드로 전환" }));

    expect(screen.getByTestId("cai-concept")).toHaveClass("is-dark");
    expect(container.querySelector(".portfolio-app")).toHaveClass("is-dark");
    expect(screen.getByRole("button", { name: "라이트 모드로 전환" })).toBeInTheDocument();
  });

  test("keeps every image non-draggable", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    expect([...container.querySelectorAll("img")].every((image) => image.draggable === false)).toBe(true);
  });

  test("shows project thumbnails in their original colors", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    const firstThumbnail = container.querySelector(".cai-image-wrap img");

    expect(getComputedStyle(firstThumbnail).filter).toBe("none");
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

    expect(cards[0].querySelector(".cai-project-hover")).not.toBeInTheDocument();
    expect(analystOverlay).toBeInTheDocument();
    expect(cards[1].querySelector(".cai-image-wrap")).toContainElement(analystOverlay);
    expect(analystOverlay).toHaveTextContent("크립토 시장을 더 빠르게 이해하는 AI 애널리스트");
    expect(analystOverlay).toHaveAttribute("aria-hidden", "true");
    expect(getComputedStyle(analystOverlay).display).toBe("grid");
    expect(getComputedStyle(analystOverlay).placeItems).toBe("center");
    expect(getComputedStyle(analystOverlay).backgroundColor).toBe("rgba(0, 0, 0, 0.4)");
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

    fireEvent.click(screen.getByRole("button", { name: "About" }));
    expect(getComputedStyle(screen.getByRole("heading", { name: "About" })).fontFamily).toContain("Pretendard");
    expect(getComputedStyle(screen.getByText("블루밍비트(Bloomingbit)")).fontFamily).toContain("Pretendard");
  });

  test("keeps the project gallery spacing uniformly compact", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    const gridStyle = getComputedStyle(container.querySelector(".cai-project-grid"));

    expect(gridStyle.gap).toBe("var(--portfolio-space-8) var(--portfolio-space-1)");
    expect(gridStyle.padding).toBe("10px");
  });

  test("lets the profile copy use the available sidebar width", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: TestRouter });
    const profileParagraph = container.querySelector(".cai-profile-copy p");

    expect(getComputedStyle(profileParagraph).maxWidth).toBe("100%");
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

    fireEvent.click(screen.getByRole("link", { name: "Home" }));

    expect(projectList.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  test("changes only the right area to the About view", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });

    fireEvent.click(screen.getByRole("button", { name: "About" }));

    expect(screen.getByTestId("interactive-orb")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(screen.getByText("데이터 중심 서비스 & LLM AI 검색 구축 경험")).toBeInTheDocument();
    expect(screen.getByText("글로벌 서비스 및 다국어 시스템 대응 경험")).toBeInTheDocument();
    expect(screen.getByText("디자인 시스템 구축 및 AI 기반 생산성 향상")).toBeInTheDocument();
    expect(screen.getByText("블루밍비트(Bloomingbit)")).toBeInTheDocument();
    expect(screen.queryAllByTestId("cai-project")).toHaveLength(0);
  });

  test("opens About directly from a project detail navigation link", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/", state: { view: "experience" } }]}>
        <PortfolioThemeProvider>
          <ProjectTransitionProvider><CaiConceptPage /></ProjectTransitionProvider>
        </PortfolioThemeProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(screen.queryAllByTestId("cai-project")).toHaveLength(0);
  });

  test("returns from About to the project list through Home", () => {
    render(<CaiConceptPage />, { wrapper: TestRouter });
    const rightPanel = screen.getByLabelText("프로젝트 세로 목록");
    rightPanel.scrollTo = vi.fn();

    fireEvent.click(screen.getByRole("button", { name: "About" }));
    fireEvent.click(screen.getByRole("link", { name: "Home" }));

    expect(screen.getAllByTestId("cai-project")).toHaveLength(12);
    expect(rightPanel.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
