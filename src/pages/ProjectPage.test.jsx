import { render, screen, waitFor } from "@testing-library/react";
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
    await waitFor(() => expect(document.title).toBe("Portfolio_Yoon - 크립토 뉴스 분석 AI 애널리스트"));
  });

  test("keeps full-bleed project images centered on a non-animated viewport", () => {
    const { container } = renderRoute("/projects/analyst");
    const viewport = container.querySelector(".project-images-viewport");
    const images = container.querySelector(".project-images");

    expect(viewport).toContainElement(images);
    expect(getComputedStyle(viewport).transform).toBe("translateX(-50%)");
    expect(images.querySelector("img")).toHaveAttribute("data-project-transition-target");
  });

  test("introduces the analyst project with only a title and one narrative", () => {
    const { container } = renderRoute("/projects/analyst");
    const introduction = container.querySelector(".project-intro");
    const images = container.querySelector(".project-images");

    expect(introduction).toBeInTheDocument();
    expect(introduction.compareDocumentPosition(images) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("heading", { name: "크립토 시장을 더 빠르게 이해하는 AI 애널리스트" })).toBeInTheDocument();
    expect(introduction.querySelectorAll("p")).toHaveLength(1);
    expect(introduction.querySelector("p")).toHaveTextContent(/한국경제신문이 운영하는 크립토 뉴스·데이터 플랫폼/);
    expect(introduction.querySelector("p")).toHaveTextContent(/초단기·중기·장기 관점을 구조화하고/);
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
    expect(appStyle.getPropertyValue("--portfolio-bg")).toBe("#f7f7f5");
    expect(appStyle.getPropertyValue("--portfolio-type-13")).toBe("13px");
    expect(appStyle.getPropertyValue("--portfolio-type-17")).toBe("17px");
    expect(getComputedStyle(introduction).columnGap).toBe("var(--portfolio-space-8)");
    expect(getComputedStyle(introduction).minHeight).toBe("0px");
    expect(getComputedStyle(introduction).paddingBottom).toBe("72px");
    expect(getComputedStyle(container.querySelector(".project-shell")).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(getComputedStyle(container.querySelector(".project-shell")).fontFamily).toBe("var(--portfolio-font)");
    expect(getComputedStyle(title).fontSize).toBe("var(--portfolio-type-17)");
    expect([...title.querySelectorAll("span")].map((line) => line.textContent)).toEqual([
      "크립토 시장을 더 빠르게",
      "이해하는 AI 애널리스트",
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
    expect(getComputedStyle(container.querySelector(".project-related h2")).fontSize).toBe("var(--portfolio-type-15)");
    expect(getComputedStyle(container.querySelector(".project-related h2")).fontWeight).toBe("400");
    expect(getComputedStyle(container.querySelector(".project-related h2")).color).toBe("var(--portfolio-fg)");
    expect(getComputedStyle(container.querySelector(".project-related-grid")).gridTemplateColumns).toBe("repeat(4,minmax(0,1fr))");
    expect(getComputedStyle(container.querySelector(".project-related-image")).aspectRatio).toBe("4/3");
    expect(getComputedStyle(container.querySelector(".project-related-card strong")).fontSize).toBe("var(--portfolio-type-15)");
    expect(getComputedStyle(container.querySelector(".project-related-card > span:last-child")).fontSize).toBe("var(--portfolio-type-13)");
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
    expect(previousLink).toHaveTextContent("그래픽 디자인 & 3D 비주얼");
    expect(previousLink).toHaveAttribute("href", "/projects/graphic-visual");
    expect(nextLink).toHaveTextContent("Next");
    expect(nextLink).not.toHaveTextContent("다음 프로젝트");
    expect(nextLink).toHaveTextContent("블루밍비트 알파");
    expect(nextLink).toHaveAttribute("href", "/projects/bloomingbit-alpha");
    expect(previousLink.querySelector(".project-pagination-chevron")).toBeInTheDocument();
    expect(nextLink.querySelector(".project-pagination-chevron")).toBeInTheDocument();
    expect(getComputedStyle(previousLink).flexDirection).toBe("column");
    expect(getComputedStyle(pagination).borderTopWidth).toBe("0px");
    expect(getComputedStyle(pagination).paddingBottom).toBe("40px");
    expect(getComputedStyle(previousLink.querySelector(".project-pagination-label")).fontSize).toBe("15px");
    expect(getComputedStyle(previousLink.querySelector(".project-pagination-label")).color).toBe("var(--portfolio-fg)");
    expect(getComputedStyle(previousLink.querySelector(".project-pagination-title")).fontSize).toBe("13px");
    expect(getComputedStyle(previousLink.querySelector(".project-pagination-title")).color).toBe("var(--portfolio-muted)");
    expect(getComputedStyle(related).borderTopWidth).toBe("1px");
    expect(getComputedStyle(related).borderTopColor).toBe("rgba(18, 18, 18, 0.12)");
    expect(getComputedStyle(related).paddingTop).toBe("32px");
  });

  test("omits Related Works when there is no same-company project", () => {
    const { container } = renderRoute("/projects/graphic-visual");

    expect(screen.queryByRole("heading", { name: "Related Works" })).not.toBeInTheDocument();
    expect(container.querySelector(".project-related")).not.toBeInTheDocument();
  });

  test("matches the home menu typography and destinations without a detail theme control", () => {
    renderRoute("/projects/analyst");
    const navigation = screen.getByRole("navigation", { name: "상세 페이지 메뉴" });
    const projects = screen.getByRole("link", { name: "Projects" });
    const home = screen.getByRole("link", { name: "Home" });
    const about = screen.getByRole("link", { name: "About" });

    expect(navigation.querySelector(".project-back")).toBe(projects);
    expect(navigation.querySelector(".project-menu")).toContainElement(home);
    expect(navigation.querySelector(".project-menu")).toContainElement(about);
    expect(projects).toHaveAttribute("href", "/");
    expect(home).toHaveAttribute("href", "/");
    expect(about).toHaveAttribute("href", "/about");
    expect(screen.queryByRole("link", { name: "Experience" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /모드로 전환/ })).not.toBeInTheDocument();
    expect(getComputedStyle(navigation).top).toBe("24px");
    expect(getComputedStyle(navigation).left).toBe("max(var(--page-gutter),calc((100vw - var(--max))/2))");
    expect(getComputedStyle(navigation).right).toBe("max(var(--page-gutter),calc((100vw - var(--max))/2))");
    expect(getComputedStyle(navigation.querySelector(".project-menu")).gap).toBe("16px");
    expect(getComputedStyle(projects).fontSize).toBe("15px");
    expect(getComputedStyle(projects).fontWeight).toBe("400");
    expect(getComputedStyle(home).fontSize).toBe("15px");
    expect(getComputedStyle(home).fontWeight).toBe("400");
    expect(getComputedStyle(about).fontSize).toBe("15px");
    expect(getComputedStyle(about).fontWeight).toBe("400");
    expect(getComputedStyle(projects).color).toBe("var(--portfolio-fg)");
    expect(getComputedStyle(home).color).toBe("var(--portfolio-fg)");
    expect(getComputedStyle(about).color).toBe("var(--portfolio-fg)");
    expect(getComputedStyle(navigation).position).toBe("fixed");
    expect(getComputedStyle(navigation).backgroundColor).toBe("rgba(0, 0, 0, 0)");
    expect(getComputedStyle(navigation).borderTopWidth).toBe("0px");
  });

  test("renders a useful fallback for an unknown project", () => {
    renderRoute("/projects/not-real");
    expect(screen.getByRole("heading", { name: "프로젝트를 찾을 수 없습니다." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "프로젝트 목록으로" })).toHaveAttribute("href", "/");
  });
});
