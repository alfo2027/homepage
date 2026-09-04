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
  window.location.hash = "#/";
  render(<App />);

  fireEvent.click(screen.getByRole("link", { name: /크립토 뉴스 분석 AI 애널리스트/ }));

  expect(screen.getByTestId("project-transition-cover")).toBeInTheDocument();
  expect(screen.getByTestId("cai-concept")).toBeInTheDocument();

  await act(async () => vi.advanceTimersByTime(500));
  expect(screen.getByRole("heading", { name: "크립토 시장을 더 빠르게 이해하는 AI 애널리스트" })).toBeInTheDocument();

  await act(async () => vi.advanceTimersByTime(400));
  expect(screen.queryByTestId("project-transition-cover")).not.toBeInTheDocument();
  vi.useRealTimers();
});
