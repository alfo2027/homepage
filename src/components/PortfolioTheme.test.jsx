import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { PortfolioThemeProvider, usePortfolioTheme } from "./PortfolioTheme";

function ThemeConsumer() {
  const { dark, toggleTheme } = usePortfolioTheme();
  return <button type="button" onClick={toggleTheme}>{dark ? "dark" : "light"}</button>;
}

describe("PortfolioTheme", () => {
  beforeEach(() => {
    const storage = new Map();
    vi.stubGlobal("localStorage", {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  test("remembers dark and light choices after remounting", () => {
    const mount = () => render(<PortfolioThemeProvider><ThemeConsumer /></PortfolioThemeProvider>);
    let view = mount();
    fireEvent.click(screen.getByRole("button", { name: "light" }));
    view.unmount();
    view = mount();
    expect(screen.getByRole("button", { name: "dark" })).toBeInTheDocument();
    expect(document.body).toHaveClass("is-portfolio-dark");
    fireEvent.click(screen.getByRole("button", { name: "dark" }));
    view.unmount();
    view = mount();
    expect(screen.getByRole("button", { name: "light" })).toBeInTheDocument();
    expect(document.body).not.toHaveClass("is-portfolio-dark");
  });
  test("shares one session theme through the application root", () => {
    const { container } = render(
      <PortfolioThemeProvider>
        <ThemeConsumer />
      </PortfolioThemeProvider>,
    );
    const root = container.querySelector(".portfolio-app");

    expect(root).toBeInTheDocument();
    expect(root).not.toHaveClass("is-dark");
    expect(screen.getByRole("button", { name: "light" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "light" }));

    expect(root).toHaveClass("is-dark");
    expect(screen.getByRole("button", { name: "dark" })).toBeInTheDocument();
  });
});
