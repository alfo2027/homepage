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
    await waitFor(() => expect(document.title).toBe("윤미래 Product Designer — 크립토 뉴스 분석 AI 애널리스트"));
  });

  test("wraps previous and next navigation across published projects", () => {
    renderRoute("/projects/analyst");

    expect(screen.getByRole("link", { name: /이전 그래픽 디자인 & 3D 비주얼/ })).toHaveAttribute("href", "/projects/graphic-visual");
    expect(screen.getByRole("link", { name: /다음 블루밍비트 알파/ })).toHaveAttribute("href", "/projects/bloomingbit-alpha");
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
