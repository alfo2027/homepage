import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import HomePage from "./HomePage";

const renderHome = () => render(<HomePage />, { wrapper: MemoryRouter });

describe("home page", () => {
  test("renders the approved hero and section headings", () => {
    renderHome();

    expect(screen.getByRole("heading", { name: /디자이너 윤미래입니다/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Contact" })).toBeInTheDocument();
  });

  test("renders twelve project cards and keeps the upcoming card inactive", () => {
    renderHome();

    expect(screen.getAllByTestId("project-card")).toHaveLength(12);
    expect(screen.getByText("UPCOMING").closest("a")).toBeNull();
    expect(screen.getAllByRole("link", { name: /프로젝트 보기/ })).toHaveLength(11);
  });

  test("renders four closed experience accordions", () => {
    const { container } = renderHome();
    const accordions = [...container.querySelectorAll("details.experience-item")];

    expect(accordions).toHaveLength(4);
    expect(accordions.every((item) => !item.open)).toBe(true);
  });

  test("prevents native dragging for every image", () => {
    const { container } = renderHome();
    const images = [...container.querySelectorAll("img")];

    expect(images).toHaveLength(12);
    expect(images.every((image) => image.draggable === false)).toBe(true);
  });
});
