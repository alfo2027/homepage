import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import CaiConceptPage from "./CaiConceptPage";

vi.mock("../components/InteractiveOrb", () => ({ default: () => <div data-testid="interactive-orb" /> }));

describe("Cai-inspired concept page", () => {
  test("renders the vertical work index with all navigation in the left sidebar", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("cai-concept")).toBeInTheDocument();
    expect(screen.getAllByTestId("cai-project")).toHaveLength(12);
    expect(screen.getByRole("heading", { name: "윤미래" })).toBeInTheDocument();
    expect(screen.getByLabelText("프로젝트 세로 목록")).toHaveClass("cai-grid-scroll");
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "두 번째 콘셉트 메뉴" })).toHaveTextContent("Experience");
    expect(screen.queryByText("About")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Work" })).not.toBeInTheDocument();
    expect(container.querySelector(".cai-side-top > .cai-side-menu")).toBeInTheDocument();
    expect(container.querySelector(".cai-side-right")).not.toBeInTheDocument();
    expect(container.querySelector(".cai-side-bottom > [data-testid='interactive-orb']")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /모드로 전환/ })).not.toBeInTheDocument();
    expect(screen.getByTestId("custom-cursor")).toBeInTheDocument();
    expect(screen.getAllByTestId("cai-project")[0]).not.toHaveAttribute("data-cursor");
    expect(screen.getAllByTestId("cai-project")[1]).toHaveAttribute("data-cursor", "project");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("data-cursor", "link");
    expect(screen.getByRole("button", { name: "Experience" })).toHaveAttribute("data-cursor", "link");
    expect(container.querySelector(".cai-project-grid")).toHaveClass("has-scroll-rhythm");
    expect(screen.getByRole("progressbar", { name: "프로젝트 스크롤 진행률" })).toBeInTheDocument();
    expect(container.querySelector(".cai-scroll-progress-fill")).toHaveStyle({ transform: "scaleY(0)" });
    expect(screen.queryByText("Information")).not.toBeInTheDocument();
    expect(screen.queryByText("Available for thoughtful collaborations.")).not.toBeInTheDocument();
  });

  test("keeps every image non-draggable", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: MemoryRouter });
    expect([...container.querySelectorAll("img")].every((image) => image.draggable === false)).toBe(true);
  });

  test("uses Pretendard with enlarged project titles and descriptions", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: MemoryRouter });
    const pageStyle = getComputedStyle(screen.getByTestId("cai-concept"));
    const firstProject = screen.getAllByTestId("cai-project")[0];

    expect(pageStyle.fontFamily).toContain("Pretendard");
    expect(getComputedStyle(firstProject.querySelector("h2")).fontSize).toBe("24px");
    expect(getComputedStyle(firstProject.querySelector(".cai-project-copy p")).fontSize).toBe("18px");

    fireEvent.click(screen.getByRole("button", { name: "Experience" }));
    expect(getComputedStyle(screen.getByRole("heading", { name: "Experience" })).fontFamily).toContain("Pretendard");
    expect(getComputedStyle(screen.getByText("블루밍비트(Bloomingbit)")).fontFamily).toContain("Pretendard");
  });

  test("keeps every project thumbnail visible when the mobile page uses document scrolling", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === "(max-width: 640px)",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    const { container } = render(<CaiConceptPage />, { wrapper: MemoryRouter });
    const thumbnails = [...container.querySelectorAll(".cai-image-wrap")];

    expect(thumbnails).toHaveLength(12);
    expect(thumbnails.every((thumbnail) => thumbnail.style.opacity !== "0" && thumbnail.style.visibility !== "hidden")).toBe(true);
    window.matchMedia = originalMatchMedia;
  });
  test("scrolls the project area to the top when Home is clicked", () => {
    render(<CaiConceptPage />, { wrapper: MemoryRouter });
    const projectList = screen.getByLabelText("프로젝트 세로 목록");
    projectList.scrollTo = vi.fn();

    fireEvent.click(screen.getByRole("link", { name: "Home" }));

    expect(projectList.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  test("changes only the right area to the Experience view", () => {
    render(<CaiConceptPage />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole("button", { name: "Experience" }));

    expect(screen.getByTestId("interactive-orb")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByText("데이터 중심 서비스 & LLM AI 검색 구축 경험")).toBeInTheDocument();
    expect(screen.getByText("글로벌 서비스 및 다국어 시스템 대응 경험")).toBeInTheDocument();
    expect(screen.getByText("디자인 시스템 구축 및 AI 기반 생산성 향상")).toBeInTheDocument();
    expect(screen.getByText("블루밍비트(Bloomingbit)")).toBeInTheDocument();
    expect(screen.queryAllByTestId("cai-project")).toHaveLength(0);
  });

  test("returns from Experience to the project list through Home", () => {
    render(<CaiConceptPage />, { wrapper: MemoryRouter });
    const rightPanel = screen.getByLabelText("프로젝트 세로 목록");
    rightPanel.scrollTo = vi.fn();

    fireEvent.click(screen.getByRole("button", { name: "Experience" }));
    fireEvent.click(screen.getByRole("link", { name: "Home" }));

    expect(screen.getAllByTestId("cai-project")).toHaveLength(12);
    expect(rightPanel.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
