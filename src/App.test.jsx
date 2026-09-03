import { render, screen } from "@testing-library/react";
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
