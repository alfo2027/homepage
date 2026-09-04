import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import App from "./App";

vi.mock("./components/InteractiveOrb", () => ({ default: () => <div data-testid="interactive-orb" /> }));
vi.mock("./components/RiveThemeToggle", () => ({ default: () => <button type="button">Theme</button> }));

test("renders the Westie portfolio at the default route", () => {
  window.location.hash = "#/";
  render(<App />);

  expect(screen.getByTestId("cai-concept")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "윤미래" })).toBeInTheDocument();
});

test("keeps the previous homepage available at the original route", () => {
  window.location.hash = "#/original";
  render(<App />);

  expect(screen.getByRole("heading", { name: /디자이너 윤미래입니다/ })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
});

test("expands the selected thumbnail before revealing its project detail", async () => {
  vi.useFakeTimers();
  const rectSpy = vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function getRect() {
    if (this.matches?.("[data-project-transition-target]")) {
      return { top: 420, left: 0, width: 1000, height: 644, right: 1000, bottom: 1064, x: 0, y: 420, toJSON() {} };
    }
    return { top: 120, left: 360, width: 420, height: 315, right: 780, bottom: 435, x: 360, y: 120, toJSON() {} };
  });
  window.location.hash = "#/";
  render(<App />);

  fireEvent.click(screen.getByRole("link", { name: /크립토 뉴스 분석 AI 애널리스트/ }));

  expect(screen.getByTestId("project-transition-cover")).toBeInTheDocument();
  expect(screen.getByTestId("cai-concept")).toBeInTheDocument();

  await act(async () => vi.advanceTimersByTime(500));
  expect(screen.getByRole("heading", { name: "크립토 시장을 더 빠르게 이해하는 AI 애널리스트" })).toBeInTheDocument();
  expect(screen.getByTestId("project-transition-cover")).toHaveStyle({
    top: "420px",
    left: "0px",
    width: "1000px",
    height: "644px",
  });

  await act(async () => vi.advanceTimersByTime(900));
  expect(screen.queryByTestId("project-transition-cover")).not.toBeInTheDocument();
  rectSpy.mockRestore();
  vi.useRealTimers();
});
