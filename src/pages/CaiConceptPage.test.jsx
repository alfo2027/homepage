import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import CaiConceptPage from "./CaiConceptPage";

vi.mock("../components/InteractiveOrb", () => ({ default: () => <div data-testid="interactive-orb" /> }));
vi.mock("../components/RiveThemeToggle", () => ({ default: () => <button data-testid="rive-toggle">Theme</button> }));

describe("Cai-inspired concept page", () => {
  test("renders the vertical work index with all navigation in the left sidebar", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("cai-concept")).toBeInTheDocument();
    expect(screen.getAllByTestId("cai-project")).toHaveLength(12);
    expect(screen.getByRole("heading", { name: "윤미래" })).toBeInTheDocument();
    expect(screen.getByLabelText("프로젝트 세로 목록")).toHaveClass("cai-grid-scroll");
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "두 번째 콘셉트 메뉴" })).toHaveTextContent("About");
    expect(screen.getByRole("navigation", { name: "두 번째 콘셉트 메뉴" })).toHaveTextContent("Experience");
    expect(container.querySelector(".cai-side-top > .cai-side-menu")).toBeInTheDocument();
    expect(container.querySelector(".cai-side-right")).not.toBeInTheDocument();
    expect(screen.getByTestId("interactive-orb")).toBeInTheDocument();
    expect(screen.getByTestId("rive-toggle")).toBeInTheDocument();
    expect(screen.getByTestId("custom-cursor")).toBeInTheDocument();
    expect(screen.getAllByTestId("cai-project")[0]).not.toHaveAttribute("data-cursor");
    expect(screen.getAllByTestId("cai-project")[1]).toHaveAttribute("data-cursor", "project");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("data-cursor", "link");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/original");
    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute("href", "/original");
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
});
