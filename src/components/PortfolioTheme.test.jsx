import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PortfolioThemeProvider, usePortfolioTheme } from "./PortfolioTheme";

function ThemeConsumer() {
  const { dark, toggleTheme } = usePortfolioTheme();
  return <button type="button" onClick={toggleTheme}>{dark ? "dark" : "light"}</button>;
}

describe("PortfolioTheme", () => {
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
