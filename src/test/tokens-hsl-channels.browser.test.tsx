import { afterEach, expect, test } from "vitest";
import hslChannelsSheet from "../styles/tokens-hsl-channels.css?inline";
import { applyTheme } from "./browser/environment";
import type { Theme } from "./browser/environment";
import { readStyle } from "./browser/measure";

// A shadcn v3 app: every variable holds bare HSL channels, light on :root and dark on .dark.
const CHANNEL_VARIABLES = `
  :root { --primary: 222 47% 11%; --card: 0 0% 100%; }
  .dark { --primary: 210 40% 98%; --card: 222 47% 11%; }
`;

const EXPECTED: Record<Theme, { primary: string; card: string }> = {
  light: { primary: "rgb(15, 23, 41)", card: "rgb(255, 255, 255)" },
  dark: { primary: "rgb(248, 250, 252)", card: "rgb(15, 23, 41)" },
};

const TRANSPARENT = "rgba(0, 0, 0, 0)";

const addStyle = (css: string) => {
  const style = document.createElement("style");
  style.dataset.testSheet = "";
  style.textContent = css;
  document.head.append(style);
};

const paintedSwatch = (token: string) => {
  const swatch = document.createElement("div");
  swatch.style.backgroundColor = `var(${token})`;
  document.body.append(swatch);
  return readStyle(swatch, "background-color");
};

afterEach(() => {
  document.querySelectorAll("[data-test-sheet], body > div:empty").forEach((node) => node.remove());
});

test("without the sheet, channel variables leave the bridged token invalid", () => {
  addStyle(CHANNEL_VARIABLES);
  expect(paintedSwatch("--gdy-primary")).toBe(TRANSPARENT);
});

test.each(["light", "dark"] as const)("with the sheet the %s tokens compute a valid color", (theme) => {
  addStyle(CHANNEL_VARIABLES);
  addStyle(hslChannelsSheet);
  applyTheme(theme);
  expect(paintedSwatch("--gdy-primary")).toBe(EXPECTED[theme].primary);
  expect(paintedSwatch("--gdy-card")).toBe(EXPECTED[theme].card);
});

test("a plain rule of the app still wins over the sheet", () => {
  addStyle(CHANNEL_VARIABLES);
  addStyle(hslChannelsSheet);
  addStyle(":root { --gdy-primary: rgb(1, 2, 3); }");
  expect(paintedSwatch("--gdy-primary")).toBe("rgb(1, 2, 3)");
});
