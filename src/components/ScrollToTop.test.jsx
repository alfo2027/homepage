import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { expect, test, vi } from "vitest";
import ScrollToTop from "./ScrollToTop";

test("does not expose the browser scroll return value as an effect cleanup", () => {
  const scrollResult = { browserSpecific: true };
  window.scrollTo = vi.fn(() => scrollResult);

  const view = render(<MemoryRouter><ScrollToTop /></MemoryRouter>);

  expect(() => view.unmount()).not.toThrow();
});

test("restores a reload position and records the current position before leaving", () => {
  const values = new Map([["portfolio-reload-scroll", JSON.stringify({ url: window.location.href, y: 800 })]]);
  vi.stubGlobal("sessionStorage", {
    getItem: (key) => values.get(key),
    setItem: (key, value) => values.set(key, value),
  });
  vi.stubGlobal("performance", { getEntriesByType: () => [{ type: "reload" }] });
  vi.stubGlobal("scrollY", 1200);
  window.scrollTo = vi.fn();
  try {
    const view = render(<MemoryRouter><ScrollToTop /></MemoryRouter>);
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 800, left: 0, behavior: "instant" });
    window.dispatchEvent(new Event("pagehide"));
    expect(JSON.parse(values.get("portfolio-reload-scroll")).y).toBe(1200);
    view.unmount();
  } finally {
    vi.unstubAllGlobals();
  }
});
