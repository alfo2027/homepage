import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "./App";

test("renders the portfolio introduction", () => {
  render(<App />);

  expect(
    screen.getByRole("heading", { name: /디자이너 윤미래입니다/ }),
  ).toBeInTheDocument();
});
