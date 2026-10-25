import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import {
  computeSpecificity,
  formatSpecificity,
  listCompoundRules,
} from "../../scripts/style-specificity.mjs";

const specificityOf = (selector: string) => formatSpecificity(computeSpecificity(selector));

describe("computeSpecificity", () => {
  test.each([
    [".gdy-table-row", "0-1-0"],
    [".gdy-table-cell.gdy-empty", "0-2-0"],
    [".gdy-table-row[data-clickable]:hover .gdy-table-cell", "0-4-0"],
    [".gdy-menu-item svg", "0-1-1"],
    [".gdy-button:where([data-variant=\"outline\"])", "0-1-0"],
    [".gdy-kanban-card:where([data-draggable])", "0-1-0"],
    [".gdy-a:not(.gdy-b, #main)", "1-1-0"],
    [".gdy-a::after", "0-1-1"],
  ])("%s weighs %s", (selector, expected) => {
    expect(specificityOf(selector)).toBe(expected);
  });
});

const TABLE_COMPOUND_RULES = {
  ".gdy-table-cell.gdy-empty": "0-2-0",
  ".gdy-table-row[data-clickable]": "0-2-0",
  ".gdy-table-row[data-clickable]:hover .gdy-table-cell": "0-4-0",
  ".gdy-table-row:focus-visible": "0-2-0",
  '.gdy-table-head-cell[data-align="center"]': "0-2-0",
  '.gdy-table-cell[data-align="center"]': "0-2-0",
  '.gdy-table-head-cell[data-align="right"]': "0-2-0",
  '.gdy-table-cell[data-align="right"]': "0-2-0",
  '.gdy-table-head-trigger[data-align="center"]': "0-2-0",
  '.gdy-table-head-trigger[data-align="right"]': "0-2-0",
  ".gdy-select-trigger.gdy-table-inline-select": "0-2-0",
  '.gdy-table-actions-cell[data-align="left"]': "0-2-0",
  '.gdy-table-actions-cell[data-align="center"]': "0-2-0",
  ".gdy-table-group-toggle:hover": "0-2-0",
  '.gdy-table-group-toggle[aria-expanded="false"] .gdy-table-group-chevron': "0-3-0",
  ".gdy-table-fill .gdy-card": "0-2-0",
  ".gdy-table-fill .gdy-table-wrap": "0-2-0",
  ".gdy-table-sticky .gdy-table-head-cell": "0-2-0",
};

test("lists every table rule that is not a single class, the 1.1.0 alignment and focus rules included", () => {
  const css = readFileSync("src/components/table/styles.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = Object.fromEntries(listCompoundRules(css).map((rule) => [rule.selector, rule.specificity]));
  expect(rules).toEqual(TABLE_COMPOUND_RULES);
});
