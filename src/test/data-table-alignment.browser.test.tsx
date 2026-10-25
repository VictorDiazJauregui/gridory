import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable, type ColumnAlign, type ColumnDefinition, type RowActions } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, BASELINE_ROW_ACTIONS, type BaselineRow } from "./baseline-fixture";
import { findRequiredElement } from "./browser/elements";
import { measureBox, type MeasuredBox } from "./browser/measure";

interface AmountColumnOptions {
  align: ColumnAlign;
  headerAlign?: ColumnAlign;
  sortable?: boolean;
}

const buildAmountColumn = (options: AmountColumnOptions): ColumnDefinition<BaselineRow> => ({
  id: "amount",
  header: "Monto",
  accessor: (row) => row.name.length * 1000,
  cell: (row) => `USD ${row.name.length * 1000}`,
  width: 200,
  ...options,
});

const renderTable = (column: ColumnDefinition<BaselineRow>, rowActions?: RowActions<BaselineRow>) =>
  render(
    <DataTable columns={[...BASELINE_COLUMNS, column]} data={BASELINE_ROWS} getRowId={(row) => row.id} rowActions={rowActions} />,
  ).container;

// The visible box of an element's text, not of the (full-width) element itself.
const measureText = (element: Element): MeasuredBox => {
  const range = document.createRange();
  range.selectNodeContents(element);
  const { top, right, bottom, left, width, height } = range.getBoundingClientRect();
  return { top, right: Math.round(right), bottom, left: Math.round(left), width, height };
};

// Title and sort icon together: from the title's left edge to the last element's right edge.
const measureHeaderBlock = (container: HTMLElement) => {
  const trigger = findRequiredElement(container, 'th[data-column-id="amount"] .gdy-table-head-trigger');
  const left = measureBox(trigger.firstElementChild as Element).left;
  const right = measureBox(trigger.lastElementChild as Element).right;
  return { left, right, center: (left + right) / 2 };
};

const measureCellText = (container: HTMLElement) =>
  measureText(findRequiredElement(container, 'td[data-column-id="amount"] .gdy-table-cell-content'));

test.each([true, false])("right: the header block and the cells end on the same edge (sortable %s)", (sortable) => {
  const container = renderTable(buildAmountColumn({ align: "right", sortable }));
  expect(Math.abs(measureHeaderBlock(container).right - measureCellText(container).right)).toBeLessThanOrEqual(1);
});

test("center: the header block and the cells share their center", () => {
  const container = renderTable(buildAmountColumn({ align: "center" }));
  const text = measureCellText(container);
  expect(Math.abs(measureHeaderBlock(container).center - (text.left + text.right) / 2)).toBeLessThanOrEqual(1);
});

test("headerAlign left keeps the header at the start while the cells go right", () => {
  const container = renderTable(buildAmountColumn({ align: "right", headerAlign: "left" }));
  const header = measureBox(findRequiredElement(container, 'th[data-column-id="amount"] .gdy-table-head-trigger'));
  expect(measureHeaderBlock(container).left).toBe(header.left);
  expect(measureCellText(container).right).toBe(measureBox(findRequiredElement(container, 'td[data-column-id="amount"] .gdy-table-cell-content')).right);
});

test.each(["right", "center"] as ColumnAlign[])("actions column %s: its label and its ⋯ button line up", (align) => {
  const container = renderTable(buildAmountColumn({ align: "right" }), { ...BASELINE_ROW_ACTIONS, columnLabel: "Acciones", align });
  const label = measureBox(findRequiredElement(container, ".gdy-table-actions-head-label"));
  const button = measureBox(findRequiredElement(container, ".gdy-table-actions-cell button"));
  const edgeOf = (box: MeasuredBox) => (align === "right" ? box.right : (box.left + box.right) / 2);
  expect(Math.abs(edgeOf(label) - edgeOf(button))).toBeLessThanOrEqual(1);
});

test("the actions column label keeps the header row at its height", () => {
  const plain = renderTable(buildAmountColumn({ align: "right" }), BASELINE_ROW_ACTIONS);
  const plainHeight = measureBox(findRequiredElement(plain, ".gdy-table-head-row")).height;
  plain.remove();
  const labelled = renderTable(buildAmountColumn({ align: "right" }), { ...BASELINE_ROW_ACTIONS, columnLabel: "Acciones" });
  expect(measureBox(findRequiredElement(labelled, ".gdy-table-head-row")).height).toBe(plainHeight);
});
