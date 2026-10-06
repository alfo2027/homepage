import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import App from "../App";

vi.mock("../components/InteractiveOrb", () => ({ default: () => null }));

test("Notes navigation opens the simple text list", async () => {
  window.location.hash = "#/";
  const { container } = render(<App />);
  fireEvent.click(screen.getByRole("link", { name: "Notes" }));
  expect(await screen.findByRole("heading", { name: "Notes", level: 1 })).toBeInTheDocument();
  expect(container.querySelectorAll(".h-notes-page .h-note-card")).toHaveLength(4);
  expect(container.querySelector(".blog-filters")).not.toBeInTheDocument();
});

test("direct article links show content and return to the blog", async () => {
  window.location.hash = "#/blog/design-notes";
  render(<App />);
  expect(await screen.findByRole("heading", { name: "피그마만 쓰던 디자이너가 Storybook을 배포하기까지" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "직접 살펴보기 · Storybook" })).toHaveAttribute("href", "https://alfo2027.github.io/design-system/?path=/story/overview--guide");
  expect(screen.getByRole("link", { name: "Notes" })).toHaveAttribute("aria-current", "page");
  fireEvent.click(screen.getAllByRole("link", { name: "List" })[0]);
  expect(await screen.findByRole("heading", { name: "Notes", level: 1 })).toBeInTheDocument();
});

test("an unknown article has a useful way back", async () => {
  window.location.hash = "#/blog/does-not-exist";
  render(<App />);
  expect(await screen.findByRole("heading", { name: "글을 찾을 수 없습니다." })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "List" })).toHaveAttribute("href", "#/blog");
});
