import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";
import CustomCursor from "./CustomCursor";

function CursorFixture() {
  return (
    <>
      <CustomCursor />
      <a href="#work" data-cursor="link">Work</a>
      <a href="#project" data-cursor="project">Project</a>
      <button type="button" data-cursor="drag">Westie</button>
    </>
  );
}

describe("CustomCursor", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete document.elementFromPoint;
  });

  test("follows fine-pointer movement and switches label for the hovered target", () => {
    render(<CursorFixture />);
    const cursor = screen.getByTestId("custom-cursor");

    fireEvent.pointerMove(screen.getByRole("link", { name: "Project" }), { clientX: 120, clientY: 80 });

    expect(cursor).toHaveClass("is-visible", "is-project");
    expect(cursor).toHaveStyle({ transform: "translate3d(120px, 80px, 0)" });
    expect(cursor).toHaveTextContent("VIEW ↗");
  });

  test("uses compact link and drag states, then returns to the default dot", () => {
    render(<CursorFixture />);
    const cursor = screen.getByTestId("custom-cursor");

    fireEvent.pointerMove(screen.getByRole("link", { name: "Work" }), { clientX: 20, clientY: 30 });
    expect(cursor).toHaveClass("is-link");
    expect(cursor).toHaveTextContent("↗");

    fireEvent.pointerMove(screen.getByRole("button", { name: "Westie" }), { clientX: 40, clientY: 50 });
    expect(cursor).toHaveClass("is-drag");
    expect(cursor).toHaveTextContent("DRAG ↔");

    fireEvent.pointerMove(document.body, { clientX: 60, clientY: 70 });
    expect(cursor).toHaveClass("is-default");
    expect(cursor).toHaveTextContent("");
  });

  test("refreshes the hovered mode when content scrolls beneath a stationary pointer", () => {
    render(<CursorFixture />);
    const cursor = screen.getByTestId("custom-cursor");
    const project = screen.getByRole("link", { name: "Project" });
    Object.defineProperty(document, "elementFromPoint", {
      configurable: true,
      value: vi.fn(() => document.body),
    });

    fireEvent.pointerMove(project, { clientX: 120, clientY: 80 });
    expect(cursor).toHaveClass("is-project");

    fireEvent.scroll(document);

    expect(cursor).toHaveClass("is-default");
    expect(cursor).toHaveTextContent("");
  });
});
