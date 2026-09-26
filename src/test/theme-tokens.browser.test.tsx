import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { LoginForm } from "../components/auth/LoginForm";
import { findRequiredElement } from "./browser/elements";
import { applyTheme } from "./browser/environment";
import type { Theme } from "./browser/environment";
import { readStyle } from "./browser/measure";

// The `--gdy-card` values declared in src/styles/tokens.css for each theme.
const CARD_TOKEN: Record<Theme, string> = {
  light: "oklch(1 0 0)",
  dark: "oklch(0.205 0 0)",
};

test.each(["light", "dark"] as const)("the login card paints the %s card token", (theme) => {
  applyTheme(theme);
  const { container } = render(<LoginForm onSubmit={() => {}} />);
  const card = findRequiredElement(container, ".gdy-auth");
  expect(readStyle(card, "background-color")).toBe(CARD_TOKEN[theme]);
});
