import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test } from "vitest";
import App from "../App";
import "../index.css";
import { measureBox } from "./browser/measure";

const CONTROLS_PATH = "/mocks/controls";
let originalPath = "";

// The demo picks its page from the URL, as a visitor would open it.
beforeEach(() => {
  originalPath = window.location.pathname;
  window.history.pushState(null, "", CONTROLS_PATH);
  document.body.style.margin = "0";
});

afterEach(() => {
  window.history.pushState(null, "", originalPath);
  document.body.style.margin = "";
});

test("on a long page at 1920 × 1080 the theme button of the menu stays on screen", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 2, name: "Controles" })).toBeInTheDocument();
  expect(document.documentElement.scrollHeight).toBeGreaterThan(window.innerHeight);
  expect(measureBox(screen.getByTestId("theme-toggle")).bottom).toBeLessThanOrEqual(window.innerHeight);
});
