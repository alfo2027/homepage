import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import App from "./App";

vi.mock("./components/InteractiveOrb", () => ({ default: () => <div data-testid="interactive-orb" /> }));
vi.mock("./components/RiveThemeToggle", () => ({ default: () => <button type="button">Theme</button> }));

test("renders the Westie portfolio at the default route", () => {
  window.location.hash = "#/";
  render(<App />);

  expect(screen.getByTestId("cai-concept")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "YOON" })).toBeInTheDocument();
});

test("keeps the previous homepage available at the original route", () => {
  window.location.hash = "#/original";
  render(<App />);

  expect(screen.getByRole("heading", { name: /디자이너 윤미래입니다/ })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
});

test("renders About at its own route", () => {
  window.location.hash = "#/about";
  render(<App />);

  expect(screen.queryByRole("heading", { name: "About" })).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "복잡한 경험을 명확하게 만들고, 사용자의 선택과 행동을 돕습니다" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
});

test("transitions the page without carrying the thumbnail into the project detail", async () => {
  vi.useFakeTimers();
  let finishDecoding;
  const decodePromise = new Promise((resolve) => {
    finishDecoding = resolve;
  });
  const OriginalImage = window.Image;
  window.Image = class {
    decode() {
      return decodePromise;
    }
  };
  window.location.hash = "#/";
  render(<App />);

  fireEvent.click(screen.getByRole("link", { name: /크립토 뉴스 분석 AI 애널리스트/ }));

  expect(screen.queryByTestId("project-transition-cover")).not.toBeInTheDocument();
  expect(screen.getByTestId("cai-concept")).toHaveClass("is-project-leaving");

  await act(async () => vi.advanceTimersByTime(500));
  expect(screen.getByTestId("cai-concept")).toHaveClass("is-project-leaving");
  expect(screen.queryByRole("heading", { name: "크립토 시장을 더 빠르게 이해하는 AI 애널리스트" })).not.toBeInTheDocument();

  await act(async () => {
    finishDecoding();
    await decodePromise;
  });
  expect(screen.getByRole("heading", { name: "크립토 시장을 더 빠르게 이해하는 AI 애널리스트" })).toBeInTheDocument();
  expect(document.querySelector(".project-shell")).toHaveClass("is-transition-enter");
  expect(document.querySelector(".project-images img:first-child")).not.toHaveStyle({ opacity: "0" });
  window.Image = OriginalImage;
  vi.useRealTimers();
});
