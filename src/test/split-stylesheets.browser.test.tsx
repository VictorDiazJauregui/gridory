import { render } from "@testing-library/react";
import { afterAll, beforeAll, expect, test } from "vitest";
import { page } from "vitest/browser";
import { MODULE_NAMES } from "../../scripts/split-stylesheets.mjs";
import { DataTable } from "../components/table";
import baseSheet from "../styles/index.css?inline";
import { BASELINE_COLUMNS, BASELINE_VIEW_PROPS } from "./baseline-fixture";
import { applyTheme, type Theme } from "./browser/environment";

const MODULE_SHEETS = import.meta.glob<string>("../components/*/styles.css", {
  query: "?inline",
  import: "default",
  eager: true,
});
const moduleSheet = (name: string) => MODULE_SHEETS[`../components/${name}/styles.css`];

// styles.css is base.css followed by every module sheet in this order (check-split-stylesheets.mjs proves it on dist).
const WHOLE_BUNDLE = [baseSheet, ...MODULE_NAMES.map(moduleSheet)].join("\n");
const BASE_AND_TABLE = [baseSheet, moduleSheet("table")].join("\n");

// The page already carries every sheet the components import; they step aside so only the sheet under test paints.
const pageSheets = () => [...document.querySelectorAll<HTMLStyleElement>("style[data-vite-dev-id]")];
const sheetUnderTest = document.createElement("style");

beforeAll(() => {
  pageSheets().forEach((sheet) => (sheet.disabled = true));
  document.head.append(sheetUnderTest);
});

afterAll(() => {
  sheetUnderTest.remove();
  pageSheets().forEach((sheet) => (sheet.disabled = false));
});

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

const renderTable = () =>
  render(
    <div style={{ width: 1000 }} data-testid="split-sheets-table">
      <DataTable columns={BASELINE_COLUMNS} getRowId={(row) => row.id} {...BASELINE_VIEW_PROPS} />
    </div>,
  ).getByTestId("split-sheets-table");

const screenshotWith = async (css: string, element: HTMLElement): Promise<string> => {
  sheetUnderTest.textContent = css;
  // A sheet swap restarts the transitions of the styled parts (colors, borders): the screenshot waits for them.
  await nextFrame();
  await Promise.all(document.getAnimations().map((animation) => animation.finished));
  await nextFrame();
  return page.screenshot({ element, save: false });
};

test.each(["light", "dark"] as const)("base.css + table.css paint the %s table like styles.css", async (theme: Theme) => {
  applyTheme(theme);
  const table = renderTable();
  const withBundle = await screenshotWith(WHOLE_BUNDLE, table);
  const withSplitSheets = await screenshotWith(BASE_AND_TABLE, table);
  expect(withSplitSheets === withBundle, "the pixels of base.css + table.css differ from styles.css").toBe(true);
});

test("the comparison sees a missing sheet: base.css alone paints the table differently", async () => {
  const table = renderTable();
  const withBundle = await screenshotWith(WHOLE_BUNDLE, table);
  const withBaseOnly = await screenshotWith(baseSheet, table);
  expect(withBaseOnly === withBundle).toBe(false);
});
