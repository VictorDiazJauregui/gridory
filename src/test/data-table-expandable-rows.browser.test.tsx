import { fireEvent, render } from "@testing-library/react";
import { afterEach, expect, test } from "vitest";
import { DataTable, type ColumnDefinition, type DataTableProps } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { findRequiredElement } from "./browser/elements";
import { applyTheme, type Theme } from "./browser/environment";
import { measureBox, readStyle } from "./browser/measure";
import { emulateMediaType } from "./browser/print-media";
import { emulateReducedMotion } from "./browser/reduced-motion";

afterEach(async () => {
  applyTheme("light");
  await emulateMediaType("screen");
  await emulateReducedMotion(false);
});

const renderDetail = (row: BaselineRow) => <p style={{ height: 60, margin: 0 }}>Detalle de {row.name}</p>;

const renderTable = (props: Partial<DataTableProps<BaselineRow>> = {}, width = 900) =>
  render(
    <div style={{ width }}>
      <DataTable
        columns={BASELINE_COLUMNS}
        data={BASELINE_ROWS}
        getRowId={(row) => row.id}
        renderExpandedRow={renderDetail}
        {...props}
      />
    </div>,
  ).container;

// Every column with a width, so the table grows past a narrow container and scrolls sideways.
const WIDE_COLUMNS: ColumnDefinition<BaselineRow>[] = BASELINE_COLUMNS.map((column) => ({ ...column, width: 320 }));

const openRow = (container: HTMLElement, rowId: string) =>
  fireEvent.click(findRequiredElement(container, `[data-row-id="${rowId}"] .gdy-table-expand-toggle`));

const panelOf = (container: HTMLElement) => findRequiredElement(container, ".gdy-table-expanded-panel");

const waitForTransition = (element: Element) =>
  new Promise((resolve) => element.addEventListener("transitionend", resolve, { once: true }));

test.each(["light", "dark"] as Theme[])("in %s the detail spans the whole row and has its own surface", (theme) => {
  applyTheme(theme);
  const container = renderTable({ defaultExpandedRowIds: ["b1"] });
  const row = measureBox(findRequiredElement(container, '[data-row-id="b1"]'));
  const cell = findRequiredElement(container, ".gdy-table-expanded-cell");
  const detail = measureBox(cell);
  expect([detail.left, detail.right]).toEqual([row.left, row.right]);
  expect(measureBox(panelOf(container)).width).toBe(row.width);
  expect(readStyle(cell, "background-color")).not.toBe("rgba(0, 0, 0, 0)");
});

test("the 28px button fits the 40px column and opening a row leaves the other rows as tall as before", () => {
  const container = renderTable();
  const button = measureBox(findRequiredElement(container, '[data-row-id="b1"] .gdy-table-expand-toggle'));
  const cell = measureBox(findRequiredElement(container, '[data-row-id="b1"] td[data-column-id="_expand"]'));
  expect(cell.width).toBe(40);
  expect(button.left).toBeGreaterThanOrEqual(cell.left);
  expect(button.right).toBeLessThanOrEqual(cell.right);
  const heightOf = (rowId: string) => measureBox(findRequiredElement(container, `[data-row-id="${rowId}"]`)).height;
  const before = [heightOf("b1"), heightOf("b2")];
  openRow(container, "b1");
  expect([heightOf("b1"), heightOf("b2")]).toEqual(before);
});

test("the keyboard focus of the button draws a ring inside the cell", () => {
  const container = renderTable();
  const button = findRequiredElement(container, '[data-row-id="b1"] .gdy-table-expand-toggle') as HTMLElement;
  button.focus({ focusVisible: true } as FocusOptions);
  expect(readStyle(button, "outline-style")).toBe("solid");
  expect(readStyle(button, "outline-width")).toBe("2px");
});

test("the detail grows from 0 to its content height, and the chevron turns", async () => {
  const container = renderTable();
  openRow(container, "b1");
  const panel = panelOf(container);
  expect(Number.parseFloat(readStyle(panel, "transition-duration"))).toBeGreaterThan(0);
  await waitForTransition(panel);
  expect(measureBox(panel).height).toBe(measureBox(findRequiredElement(panel, ".gdy-table-expanded-body")).height);
  const chevron = findRequiredElement(container, '[data-row-id="b1"] .gdy-table-expand-chevron');
  expect(readStyle(chevron, "transform")).not.toBe("none");
});

test("closing shrinks the detail and unmounts it when the transition ends", async () => {
  const container = renderTable();
  openRow(container, "b1");
  await waitForTransition(panelOf(container));
  openRow(container, "b1");
  const panel = panelOf(container);
  expect(panel).toHaveAttribute("data-state", "closed");
  await waitForTransition(panel);
  await expect.poll(() => container.querySelector(".gdy-table-expanded-row")).toBeNull();
});

test("a detail closed before its opening transition ran still unmounts", async () => {
  const container = renderTable({ defaultExpandedRowIds: ["b1"] });
  openRow(container, "b1");
  await expect.poll(() => container.querySelector(".gdy-table-expanded-row")).toBeNull();
});

test("with reduced motion there is no transition and a closed detail leaves at once", async () => {
  await emulateReducedMotion(true);
  const container = renderTable({ defaultExpandedRowIds: ["b1"] });
  expect(readStyle(panelOf(container), "transition-duration")).toBe("0s");
  openRow(container, "b1");
  await expect.poll(() => container.querySelector(".gdy-table-expanded-row")).toBeNull();
});

test("with sideways scroll the detail takes the visible width and stays in place", async () => {
  const container = renderTable({ columns: WIDE_COLUMNS, defaultExpandedRowIds: ["b1"] }, 600);
  const wrap = findRequiredElement(container, ".gdy-table-wrap");
  expect(wrap.scrollWidth).toBeGreaterThan(wrap.clientWidth);
  await expect.poll(() => measureBox(panelOf(container)).width).toBe(wrap.clientWidth);
  wrap.scrollLeft = wrap.scrollWidth;
  const panel = measureBox(panelOf(container));
  expect(panel.left).toBe(measureBox(wrap).left);
});

test("printing keeps open details whole and drops the button column", async () => {
  const container = renderTable({ printMode: "page", defaultExpandedRowIds: ["b1"] });
  await emulateMediaType("print");
  expect(readStyle(findRequiredElement(container, 'th[data-column-id="_expand"]'), "display")).toBe("none");
  expect(readStyle(findRequiredElement(container, 'td[data-column-id="_expand"]'), "display")).toBe("none");
  const panel = panelOf(container);
  expect(readStyle(panel, "position")).toBe("static");
  expect(readStyle(panel, "transition-duration")).toBe("0s");
  expect(measureBox(panel).width).toBe(measureBox(findRequiredElement(container, '[data-row-id="b1"]')).width);
});
