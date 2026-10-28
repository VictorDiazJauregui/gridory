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
  '.gdy-table-foot-cell[data-align="center"]': "0-2-0",
  '.gdy-table-foot-cell[data-align="right"]': "0-2-0",
  '.gdy-table-head-trigger[data-align="center"]': "0-2-0",
  '.gdy-table-head-trigger[data-align="right"]': "0-2-0",
  '.gdy-table-menu-holder[data-align="end"]': "0-2-0",
  '.gdy-table-cell-content[data-overflow="wrap"]': "0-2-0",
  '.gdy-table-cell-content[data-overflow="visible"]': "0-2-0",
  ".gdy-select-trigger.gdy-table-inline-select": "0-2-0",
  '.gdy-table-actions-cell[data-align="left"]': "0-2-0",
  '.gdy-table-actions-cell[data-align="center"]': "0-2-0",
  ".gdy-table-group-toggle:hover": "0-2-0",
  '.gdy-table-group-toggle[aria-expanded="false"] .gdy-table-group-chevron': "0-3-0",
  ".gdy-table-fill .gdy-card": "0-2-0",
  ".gdy-table-fill .gdy-table-wrap": "0-2-0",
  ".gdy-table-sticky .gdy-table-head-cell": "0-2-0",
  ".gdy-table-sticky .gdy-table-foot-cell": "0-2-0",
  ".gdy-table-skeleton > .gdy-skeleton": "0-2-0",
  '.gdy-table-skeleton[data-column-id="_actions"]': "0-2-0",
  '.gdy-table-skeleton[data-column-id="_actions"] > .gdy-skeleton': "0-3-0",
  '.gdy-table-skeleton[data-column-id="_select"] > .gdy-skeleton': "0-3-0",
  ".gdy-table-row[data-selected] .gdy-table-cell": "0-3-0",
  '.gdy-table-head-cell[data-column-id="_select"]': "0-2-0",
  '.gdy-table[data-print-mode] .gdy-table-head-cell[data-column-id="_select"]': "0-4-0",
  ".gdy-table[data-print-mode] .gdy-table-head-help": "0-3-0",
  '.gdy-table-select[data-state="checked"]': "0-2-0",
  '.gdy-table-select[data-state="indeterminate"]': "0-2-0",
  ".gdy-table-select:focus-visible": "0-2-0",
  ".gdy-table-select:disabled": "0-2-0",
  '.gdy-table-head-cell[data-hidden-by="priority"]': "0-2-0",
  ".gdy-table-head-inner[data-help-placement]": "0-2-0",
  ".gdy-table-head-inner[data-help-placement] > .gdy-table-head-trigger": "0-3-0",
  '.gdy-table-head-inner[data-help-placement="edge"] > .gdy-table-head-trigger': "0-3-0",
  '.gdy-table-head-cell[data-align="center"] > .gdy-table-head-inner[data-help-placement]': "0-4-0",
  '.gdy-table-head-cell[data-align="right"] > .gdy-table-head-inner[data-help-placement]': "0-4-0",
  ".gdy-table-head-help:hover": "0-2-0",
  '.gdy-table-head-help[data-state$="open"]': "0-2-0",
  ".gdy-table-head-help:focus-visible": "0-2-0",
  '.gdy-table-cell[data-hidden-by="priority"]': "0-2-0",
  '.gdy-table-foot-cell[data-hidden-by="priority"]': "0-2-0",
  ".gdy-table[data-print-mode] .gdy-table-print-value": "0-3-0",
  ".gdy-table[data-print-mode] .gdy-table-print-value + *": "0-3-0",
  ".gdy-table[data-print-mode] .gdy-table-row[data-selected] .gdy-table-cell": "0-5-0",
  ".gdy-table[data-print-mode]": "0-2-0",
  ".gdy-table[data-print-mode] .gdy-card": "0-3-0",
  ".gdy-table[data-print-mode] .gdy-table-head-cell": "0-3-0",
  ".gdy-table[data-print-mode] .gdy-table-foot": "0-3-0",
  ".gdy-table[data-print-mode] .gdy-table-foot-cell": "0-3-0",
  ".gdy-table[data-print-mode] .gdy-table-pagination": "0-3-0",
  ".gdy-table[data-print-mode] .gdy-table-wrap": "0-3-0",
  ".gdy-table[data-print-mode] .gdy-toolbar": "0-3-0",
  '.gdy-table[data-print-mode] [data-column-id="_actions"]': "0-3-0",
  ".gdy-table[data-print-mode] thead": "0-2-1",
  ".gdy-table[data-print-mode] tr": "0-2-1",
};

test("lists every table rule that is not a single class, the alignment, focus, overflow, loading, print and totals rules included", () => {
  const css = readFileSync("src/components/table/styles.css", "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const rules = Object.fromEntries(listCompoundRules(css).map((rule) => [rule.selector, rule.specificity]));
  expect(rules).toEqual(TABLE_COMPOUND_RULES);
});
