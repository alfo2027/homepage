import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, test } from "vitest";
import NotFoundPage from "./NotFoundPage";
import ProjectPage from "./ProjectPage";
import { ProjectTransitionProvider } from "../components/ProjectTransition";
import { PortfolioThemeProvider } from "../components/PortfolioTheme";
import "../styles.css";

function renderRoute(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <PortfolioThemeProvider>
        <ProjectTransitionProvider>
          <Routes>
            <Route path="/projects/:slug" element={<ProjectPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ProjectTransitionProvider>
      </PortfolioThemeProvider>
    </MemoryRouter>,
  );
}

describe("project detail", () => {
  test("renders every analyst image without draggable behavior", async () => {
    const { container } = renderRoute("/projects/analyst");
    const images = [...container.querySelectorAll(".project-images img")];

    expect(images).toHaveLength(9);
    expect(images.every((image) => image.draggable === false)).toBe(true);
    await waitFor(() => expect(document.title).toBe("윤미래 Product Designer - 크립토 뉴스 분석 AI 애널리스트"));
  });

  test("keeps full-bleed project images centered on a non-animated viewport", () => {
    const { container } = renderRoute("/projects/analyst");
    const viewport = container.querySelector(".project-images-viewport");
    const images = container.querySelector(".project-images");

    expect(viewport).toContainElement(images);
    expect(getComputedStyle(viewport).transform).toBe("translateX(-50%)");
    expect(images.querySelector("img")).toHaveAttribute("data-project-transition-target");
  });

  test("expands the framed first image to full width as the page scrolls", async () => {
    const { container } = renderRoute("/projects/analyst");
    const shell = container.querySelector(".project-shell");
    const viewport = container.querySelector(".project-images-viewport");
    const frame = container.querySelector(".project-feature-frame");
    const firstImage = container.querySelector(".project-images img");

    Object.defineProperty(shell, "clientWidth", { configurable: true, value: 1280 });
    Object.defineProperty(viewport, "clientWidth", { configurable: true, value: 1440 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 1000 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    fireEvent.scroll(window);

    await waitFor(() => expect(frame.style.getPropertyValue("--project-feature-scale")).toBe("0.8889"));
    expect(frame).toContainElement(firstImage);
    expect(frame.style.getPropertyValue("--project-feature-radius")).toBe("16px");
    expect(frame.style.getPropertyValue("--project-feature-border-alpha")).toBe("0.05");
    expect(frame.style.getPropertyValue("--project-feature-shadow-alpha")).toBe("0.1");

    Object.defineProperty(window, "scrollY", { configurable: true, value: 420 });
    fireEvent.scroll(window);

    await waitFor(() => expect(frame.style.getPropertyValue("--project-feature-scale")).toBe("1.0000"));
    expect(frame.style.getPropertyValue("--project-feature-radius")).toBe("0px");
    expect(frame.style.getPropertyValue("--project-feature-border-alpha")).toBe("0");
    expect(frame.style.getPropertyValue("--project-feature-shadow-alpha")).toBe("0");
  });

  test("uses a white background throughout the project detail page", () => {
    const { container, unmount } = renderRoute("/projects/analyst");

    expect(document.body).toHaveClass("is-project-detail");
    expect(getComputedStyle(container.querySelector(".project-shell")).backgroundColor).toBe("rgb(255, 255, 255)");

    unmount();
    expect(document.body).not.toHaveClass("is-project-detail");
  });

  test("disables the framed first-image effect on mobile", async () => {
    const { container } = renderRoute("/projects/analyst");
    const frame = container.querySelector(".project-feature-frame");

    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    fireEvent.resize(window);

    await waitFor(() => expect(frame.style.getPropertyValue("--project-feature-scale")).toBe("1.0000"));
    expect(frame.style.getPropertyValue("--project-feature-radius")).toBe("0px");
    expect(frame.style.getPropertyValue("--project-feature-border-alpha")).toBe("0");
    expect(frame.style.getPropertyValue("--project-feature-shadow-alpha")).toBe("0");
  });

  test("introduces the analyst project with only a title and one narrative", () => {
    const { container } = renderRoute("/projects/analyst");
    const introduction = container.querySelector(".project-intro");
    const images = container.querySelector(".project-images");

    expect(introduction).toBeInTheDocument();
    expect(introduction.compareDocumentPosition(images) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("heading", { name: "쏟아지는 뉴스를 투자 판단으로 잇는 AI 분석" })).toBeInTheDocument();
    expect(introduction.querySelectorAll("p")).toHaveLength(1);
    expect(introduction.querySelector("p")).toHaveTextContent(/뉴스의 핵심 내용과 시장에 미치는 영향을 파악할 수 있는 AI 분석 기능/);
    expect(introduction.querySelector("p")).toHaveTextContent(/분석 결과를 미리 보여주고, 이용에 필요한 단계를 줄였습니다/);
    expect(screen.queryByText("회사 소개")).not.toBeInTheDocument();
    expect(screen.queryByText("프로젝트 소개")).not.toBeInTheDocument();
    expect(screen.queryByText("ROLE")).not.toBeInTheDocument();
    expect(screen.queryByText(/BLOOMINGBIT · PRODUCT DESIGN/)).not.toBeInTheDocument();
  });

  test("places the project title and narrative in a restrained two-column introduction", () => {
    const { container } = renderRoute("/projects/analyst");
    const introduction = container.querySelector(".project-intro");
    const title = introduction.querySelector("h1");
    const narrative = introduction.querySelector("p");
    const appStyle = getComputedStyle(container.querySelector(".portfolio-app"));

    expect(getComputedStyle(introduction).display).toBe("grid");
    expect(getComputedStyle(introduction).gridTemplateColumns).toBe("repeat(2,minmax(0,1fr))");
    expect(appStyle.getPropertyValue("--portfolio-bg")).toBe("#f5f5f5");
    expect(appStyle.getPropertyValue("--portfolio-type-13")).toBe("13px");
    expect(appStyle.getPropertyValue("--portfolio-type-17")).toBe("17px");
    expect(getComputedStyle(introduction).columnGap).toBe("var(--portfolio-space-8)");
    expect(getComputedStyle(introduction).minHeight).toBe("0px");
    expect(getComputedStyle(introduction).paddingBottom).toBe("72px");
    expect(getComputedStyle(container.querySelector(".project-shell")).backgroundColor).toBe("rgb(255, 255, 255)");
    expect(getComputedStyle(container.querySelector(".project-shell")).fontFamily).toBe("var(--portfolio-font)");
    expect(getComputedStyle(title).fontSize).toBe("24px");
    expect([...title.querySelectorAll("span")].map((line) => line.textContent)).toEqual([
      "쏟아지는 뉴스를 투자 판단으로",
      "잇는 AI 분석",
    ]);
    expect(getComputedStyle(title).textAlign).toBe("left");
    expect(getComputedStyle(narrative).fontSize).toBe("var(--portfolio-type-13)");
    expect(getComputedStyle(narrative).color).not.toBe(getComputedStyle(title).color);
    expect(getComputedStyle(narrative).textAlign).toBe("left");
  });

  test("shows only the available same-company work in a restrained gallery", () => {
    const { container } = renderRoute("/projects/analyst");

    expect(screen.getByRole("heading", { name: "Related Works" })).toBeInTheDocument();
    expect(container.querySelector(".project-related-card")).toHaveAttribute("href", "/projects/bloomingbit-alpha");
    expect(container.querySelectorAll(".project-related-card")).toHaveLength(1);
    expect(container.querySelector(".project-related-card img")).toHaveAttribute("src", "/assets/project-02/project-02-thumb.avif");
    expect(getComputedStyle(container.querySelector(".project-related h2")).fontSize).toBe("18px");
    expect(getComputedStyle(container.querySelector(".project-related h2")).fontWeight).toBe("600");
    expect(getComputedStyle(container.querySelector(".project-related h2")).color).toBe("var(--portfolio-fg)");
    expect(getComputedStyle(container.querySelector(".project-related-grid")).gridTemplateColumns).toBe("repeat(4,minmax(0,1fr))");
    expect(getComputedStyle(container.querySelector(".project-related-image")).aspectRatio).toBe("auto");
    expect(getComputedStyle(container.querySelector(".project-related-card strong")).fontSize).toBe("15px");
    expect(getComputedStyle(container.querySelector(".project-related-meta")).fontSize).toBe("13px");
  });

  test("shows previous and next project links before Related Works", () => {
    const { container } = renderRoute("/projects/analyst");
    const pagination = screen.getByRole("navigation", { name: "이전 및 다음 프로젝트" });
    const related = container.querySelector(".project-related");

    expect(pagination.compareDocumentPosition(related) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const previousLink = pagination.querySelector(".project-pagination-link:not(.is-next)");
    const nextLink = pagination.querySelector(".project-pagination-link.is-next");
    expect(previousLink).toHaveTextContent("Previous");
    expect(previousLink).not.toHaveTextContent("이전 프로젝트");
    expect(previousLink).toHaveTextContent("기능과 분위기를 한눈에 전하는 비주얼 만들기");
    expect(previousLink).toHaveAttribute("href", "/projects/graphic-visual");
    expect(nextLink).toHaveTextContent("Next");
    expect(nextLink).not.toHaveTextContent("다음 프로젝트");
    expect(nextLink).toHaveTextContent("흩어진 크립토 시장 정보를 한 번에 탐색하는 법");
    expect(nextLink).toHaveAttribute("href", "/projects/bloomingbit-alpha");
    expect(previousLink.querySelector(".project-pagination-chevron")).toBeInTheDocument();
    expect(nextLink.querySelector(".project-pagination-chevron")).toBeInTheDocument();
    expect(getComputedStyle(previousLink).flexDirection).toBe("column");
    expect(getComputedStyle(pagination).borderTopWidth).toBe("0px");
    expect(getComputedStyle(pagination).paddingBottom).toBe("40px");
    expect(getComputedStyle(previousLink.querySelector(".project-pagination-label")).fontSize).toBe("15px");
    expect(getComputedStyle(previousLink.querySelector(".project-pagination-label")).color).toBe("var(--portfolio-muted)");
    expect(getComputedStyle(previousLink.querySelector(".project-pagination-title")).fontSize).toBe("16px");
    expect(getComputedStyle(previousLink.querySelector(".project-pagination-title")).color).toBe("var(--portfolio-fg)");
    expect(getComputedStyle(related).borderTopWidth).toBe("0px");
    expect(getComputedStyle(related).paddingTop).toBe("32px");
  });

  test("omits Related Works when there is no same-company project", () => {
    const { container } = renderRoute("/projects/graphic-visual");

    expect(screen.queryByRole("heading", { name: "Related Works" })).not.toBeInTheDocument();
    expect(container.querySelector(".project-related")).not.toBeInTheDocument();
  });

  test("shares home navigation and compacts on document scroll", () => {
    const { container } = renderRoute("/projects/analyst");
    const nav = screen.getByRole("navigation", { name: "주 메뉴" });
    expect(nav.querySelector('a[href="/work"]')).toHaveTextContent("Work");
    expect(nav.querySelector('a[href="/about"]')).toHaveTextContent("About");
    expect(nav.querySelector('a[href="/blog"]')).toHaveTextContent("Notes");
    expect(screen.getByRole("button", { name: "다크 모드" })).toBeInTheDocument();
    expect(container.querySelector(".h-navigation")).toHaveAttribute("data-compact", "false");
    Object.defineProperty(window, "scrollY", { configurable: true, value: 100 });
    fireEvent.scroll(window);
    expect(container.querySelector(".h-navigation")).toHaveAttribute("data-compact", "true");
    fireEvent.click(container.querySelector(".h-menu-trigger"));
    expect(screen.getByRole("dialog", { name: "사이트 메뉴" })).toBeInTheDocument();
    expect(container.querySelector(".project-content")).toHaveAttribute("inert");
    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });
    expect(container.querySelector(".project-content")).not.toHaveAttribute("inert");
  });

  test("renders a useful fallback for an unknown project", () => {
    renderRoute("/projects/not-real");
    expect(screen.getByRole("heading", { name: "프로젝트를 찾을 수 없습니다." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "프로젝트 목록으로" })).toHaveAttribute("href", "/");
  });
});
