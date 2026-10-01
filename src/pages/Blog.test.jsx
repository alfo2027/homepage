import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import App from "../App";

vi.mock("../components/InteractiveOrb", () => ({ default: () => null }));

test("Notes navigation opens the list and categories narrow the articles", async () => {
  window.location.hash = "#/";
  render(<App />);
  fireEvent.click(screen.getByRole("link", { name: "Notes" }));
  expect(await screen.findByRole("heading", { name: "Blog" })).toBeInTheDocument();
  expect(screen.getAllByRole("link", { name: /글 읽기:/ })).toHaveLength(3);
  fireEvent.click(screen.getByRole("button", { name: "Design" }));
  expect(screen.getAllByRole("link", { name: /글 읽기:/ })).toHaveLength(1);
  fireEvent.click(screen.getByRole("button", { name: "All" }));
  expect(screen.getAllByRole("link", { name: /글 읽기:/ })).toHaveLength(3);
});

test("direct article links show content and return to the blog", async () => {
  window.location.hash = "#/blog/design-notes";
  render(<App />);
  expect(await screen.findByRole("heading", { name: "디자인의 과정을 기록하는 법" })).toBeInTheDocument();
  expect(screen.getByText(/레이아웃을 확인하기 위한 예시 글/)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Notes" })).toHaveAttribute("aria-current", "page");
  fireEvent.click(screen.getAllByRole("link", { name: "모든 글" })[0]);
  expect(await screen.findByRole("heading", { name: "Blog" })).toBeInTheDocument();
});

test("an unknown article has a useful way back", async () => {
  window.location.hash = "#/blog/does-not-exist";
  render(<App />);
  expect(await screen.findByRole("heading", { name: "글을 찾을 수 없습니다." })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "모든 글" })).toHaveAttribute("href", "#/blog");
});
