import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import ColabsConceptPage from "./ColabsConceptPage";

describe("Colabs-inspired concept page", () => {
  test("renders a separate portfolio concept with the existing content", () => {
    render(<ColabsConceptPage />, { wrapper: MemoryRouter });

    expect(screen.getByTestId("colabs-concept")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /디자이너 윤미래입니다/ })).toBeInTheDocument();
    expect(screen.getAllByTestId("concept-project")).toHaveLength(12);
    expect(screen.getAllByTestId("concept-experience")).toHaveLength(4);
    expect(screen.getByRole("link", { name: "기존 디자인으로 돌아가기" })).toHaveAttribute("href", "/");
  });

  test("prevents native dragging for every project image", () => {
    const { container } = render(<ColabsConceptPage />, { wrapper: MemoryRouter });
    const images = [...container.querySelectorAll("img")];

    expect(images).toHaveLength(12);
    expect(images.every((image) => image.draggable === false)).toBe(true);
  });
});
