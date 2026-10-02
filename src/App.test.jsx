import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import App from "./App";

vi.mock("./components/InteractiveOrb", () => ({ default: () => <div data-testid="interactive-orb" /> }));
vi.mock("./components/RiveThemeToggle", () => ({ default: () => <button type="button">Theme</button> }));

test("renders the Hanssen-inspired portfolio at the default route", () => {
  window.location.hash = "#/";
  render(<App />);

  expect(screen.getByTestId("hanssen-portfolio")).toBeInTheDocument();
  expect(screen.getByRole("complementary", { name: "윤미래 소개" })).toBeInTheDocument();
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
  expect(screen.getByRole("heading", { name: "복잡함을 이해하기 쉬운 경험으로 바꿉니다." })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
});

test("reveals project detail without a fullscreen thumbnail overlay", async () => {
  vi.useFakeTimers();
  const motionSpy = vi.spyOn(window, "matchMedia").mockReturnValue({ matches: false });
  const rectSpy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function getRect() {
    if (this.matches?.("[data-project-transition-target]")) {
      return { top: 420, left: 0, width: 1000, height: 644, right: 1000, bottom: 1064, x: 0, y: 420, toJSON() {} };
    }
    return { top: 120, left: 360, width: 420, height: 315, right: 780, bottom: 435, x: 360, y: 120, toJSON() {} };
  });
  window.location.hash = "#/";
  render(<App />);

  fireEvent.click(screen.getByRole("link", { name: /쏟아지는 뉴스를 투자 판단으로 잇는 AI 분석/ }));

  expect(screen.queryByTestId("project-transition-cover")).not.toBeInTheDocument();
  expect(screen.getByTestId("hanssen-portfolio")).toBeInTheDocument();

  await act(async () => vi.advanceTimersByTime(500));
  expect(screen.getByRole("heading", { name: "쏟아지는 뉴스를 투자 판단으로 잇는 AI 분석" })).toBeInTheDocument();
  expect(document.querySelector(".project-shell")).toHaveClass("is-transition-enter");
  expect(screen.queryByTestId("project-transition-cover")).not.toBeInTheDocument();
  rectSpy.mockRestore();
  motionSpy.mockRestore();
  vi.useRealTimers();
});
