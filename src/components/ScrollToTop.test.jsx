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
