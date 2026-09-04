import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, test } from "vitest";
import NotFoundPage from "./NotFoundPage";
import ProjectPage from "./ProjectPage";

function renderRoute(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/projects/:slug" element={<ProjectPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
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

  test("shows four related projects as thumbnail links", () => {
    const { container } = renderRoute("/projects/analyst");

    expect(screen.getByRole("heading", { name: "다른 프로젝트" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /블루밍비트 알파/ })).toHaveAttribute("href", "/projects/bloomingbit-alpha");
    expect(screen.getByRole("link", { name: /플랜 구매 경험 개선/ })).toHaveAttribute("href", "/projects/plan-purchase");
    expect(screen.getByRole("link", { name: /정기 선적 리포트/ })).toHaveAttribute("href", "/projects/shipment-report");
    expect(screen.getByRole("link", { name: /디자인 시스템 공통화/ })).toHaveAttribute("href", "/projects/design-system");
    expect(container.querySelectorAll(".project-related-card")).toHaveLength(4);
    expect(container.querySelectorAll(".project-related-card img")).toHaveLength(4);
  });

  test("offers a projects-list link", () => {
    const { container } = renderRoute("/projects/analyst");
    expect(container.querySelectorAll(".project-back")).toHaveLength(2);
    expect(screen.getByRole("link", { name: "목록으로" })).toBeInTheDocument();
  });

  test("renders a useful fallback for an unknown project", () => {
    renderRoute("/projects/not-real");
    expect(screen.getByRole("heading", { name: "프로젝트를 찾을 수 없습니다." })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "프로젝트 목록으로" })).toHaveAttribute("href", "/");
  });
});
