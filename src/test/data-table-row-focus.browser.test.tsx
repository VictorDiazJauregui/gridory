import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { findRequiredElement } from "./browser/elements";
import { applyTheme, type Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";

const MANY_ROWS: BaselineRow[] = Array.from({ length: 30 }, (_, index) => ({
  ...BASELINE_ROWS[index % BASELINE_ROWS.length],
  id: `r${index}`,
}));

const renderLinkTable = () =>
  render(
    <DataTable
      columns={BASELINE_COLUMNS}
      data={MANY_ROWS}
      getRowId={(row) => row.id}
      getRowHref={(row) => `/empresas/${row.id}`}
      tableMaxHeightClassName="gdy-table-max-h-sm"
    />,
  ).container;

const expectRingInsideScroller = (row: HTMLElement, scroller: Element) => {
  const ring = measureBox(row);
  const visible = measureBox(scroller);
  expect(row.matches(":focus-visible")).toBe(true);
  expect(readStyle(row, "outline-style")).toBe("solid");
  expect(readStyle(row, "outline-width")).toBe("2px");
  expect(readStyle(row, "outline-offset")).toBe("-2px");
  expect(ring.left).toBeGreaterThanOrEqual(visible.left);
  expect(ring.right).toBeLessThanOrEqual(visible.right);
  expect(ring.bottom).toBeLessThanOrEqual(visible.bottom);
};

test.each(["light", "dark"] as Theme[])("in %s the focus ring of the first and last row is drawn whole", (theme) => {
  applyTheme(theme);
  const container = renderLinkTable();
  const scroller = findRequiredElement(container, ".gdy-table-wrap");
  const header = measureBox(findRequiredElement(container, ".gdy-table-head-row"));
  const rows = container.querySelectorAll<HTMLElement>(".gdy-table-row");
  rows[0].focus();
  expectRingInsideScroller(rows[0], scroller);
  expect(measureBox(rows[0]).top).toBeGreaterThanOrEqual(header.bottom);
  const last = rows[rows.length - 1];
  last.focus();
  last.scrollIntoView({ block: "end" });
  expectRingInsideScroller(last, scroller);
});

test("the ring reads --gdy-table-row-focus-ring, falling back to the base ring", () => {
  const container = renderLinkTable();
  const row = container.querySelector<HTMLElement>(".gdy-table-row") as HTMLElement;
  row.focus();
  const baseRing = readStyle(row, "outline-color");
  row.style.setProperty("--gdy-table-row-focus-ring", "rgb(255, 0, 0)");
  expect(readStyle(row, "outline-color")).toBe("rgb(255, 0, 0)");
  expect(baseRing).not.toBe("rgb(255, 0, 0)");
});
