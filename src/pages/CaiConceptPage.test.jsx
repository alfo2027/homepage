import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import CaiConceptPage from "./CaiConceptPage";

vi.mock("../components/InteractiveOrb", () => ({ default: () => <div data-testid="interactive-orb" /> }));

describe("Cai-inspired concept page", () => {
  test("renders the vertical work index with all navigation in the left sidebar", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("cai-concept")).toBeInTheDocument();
    expect(document.title).toBe("윤미래 Product Designer");
    expect(screen.getAllByTestId("cai-project")).toHaveLength(12);
    expect(screen.getByRole("heading", { name: "윤미래" })).toBeInTheDocument();
    expect(screen.getByText("책과 전시, 감도 높은 공간과 물건들에서 새로운 영감을 얻습니다.")).toBeInTheDocument();
    expect(screen.getByText("작고 감각적인 것들을 발견해 채우는 즐거움만큼, 깨끗하게 비워진 공간도 좋아합니다.")).toBeInTheDocument();
    expect(screen.getByText("디자인도 그렇습니다. 충분히 들여다본 뒤 꼭 필요한 것만 담아 편안한 경험을 만들려 합니다.")).toBeInTheDocument();
    expect(screen.getByLabelText("프로젝트 세로 목록")).toHaveClass("cai-grid-scroll");
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "두 번째 콘셉트 메뉴" })).toHaveTextContent("About");
    expect(screen.getByRole("navigation", { name: "두 번째 콘셉트 메뉴" })).toHaveTextContent("Experience");
    expect(container.querySelector(".cai-side-top > .cai-side-menu")).toBeInTheDocument();
    expect(container.querySelector(".cai-side-right")).not.toBeInTheDocument();
    expect(screen.getByTestId("interactive-orb")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다크 모드로 전환" })).toHaveClass("cai-theme-toggle");
    expect(screen.getByTestId("custom-cursor")).toBeInTheDocument();
    expect(screen.getAllByTestId("cai-project")[0]).not.toHaveAttribute("data-cursor");
    expect(screen.getAllByTestId("cai-project")[1]).toHaveAttribute("data-cursor", "project");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("data-cursor", "link");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/original");
    expect(screen.getByRole("link", { name: "Experience" })).toHaveAttribute("href", "/original");
    expect(container.querySelector(".cai-project-grid")).toHaveClass("is-gallery-index");
    expect(screen.getAllByTestId("cai-project").every((card) => !card.style.transform)).toBe(true);
    expect(screen.getByRole("progressbar", { name: "프로젝트 스크롤 진행률" })).toBeInTheDocument();
    expect(container.querySelector(".cai-scroll-progress-fill")).toHaveStyle({ transform: "scaleY(0)" });
    expect(screen.queryByText("Information")).not.toBeInTheDocument();
    expect(screen.queryByText("Available for thoughtful collaborations.")).not.toBeInTheDocument();
  });

  test("switches the gallery between light and dark themes with the dot toggle", () => {
    render(<CaiConceptPage />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByRole("button", { name: "다크 모드로 전환" }));

    expect(screen.getByTestId("cai-concept")).toHaveClass("is-dark");
    expect(screen.getByRole("button", { name: "라이트 모드로 전환" })).toBeInTheDocument();
  });

  test("keeps every image non-draggable", () => {
    const { container } = render(<CaiConceptPage />, { wrapper: MemoryRouter });
    expect([...container.querySelectorAll("img")].every((image) => image.draggable === false)).toBe(true);
  });
});
