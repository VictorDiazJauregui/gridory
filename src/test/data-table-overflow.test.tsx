import { render } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable, type ColumnDefinition, type ColumnOverflow } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, BASELINE_ROW_ACTIONS, type BaselineRow } from "./baseline-fixture";

const withOverflow = (overflow: ColumnOverflow): ColumnDefinition<BaselineRow>[] => [
  { ...BASELINE_COLUMNS[0], overflow },
  ...BASELINE_COLUMNS.slice(1),
];

const renderTable = (columns: ColumnDefinition<BaselineRow>[]) =>
  render(
    <DataTable columns={columns} data={BASELINE_ROWS} getRowId={(row) => row.id} rowActions={BASELINE_ROW_ACTIONS} />,
  ).container;

const overflowOf = (container: HTMLElement, columnId: string) =>
  [...container.querySelectorAll(`td[data-column-id="${columnId}"] .gdy-table-cell-content`)].map((content) =>
    content.getAttribute("data-overflow"),
  );

test.each(["ellipsis", "wrap", "visible"] as ColumnOverflow[])("overflow %s marks every cell content of its column", (overflow) => {
  const container = renderTable(withOverflow(overflow));
  expect(overflowOf(container, "name")).toEqual([overflow, overflow, overflow]);
});

test("each column keeps its own overflow", () => {
  const columns = [{ ...BASELINE_COLUMNS[0], overflow: "wrap" as const }, { ...BASELINE_COLUMNS[1], overflow: "visible" as const }, BASELINE_COLUMNS[2]];
  const container = renderTable(columns);
  expect(overflowOf(container, "name")).toEqual(["wrap", "wrap", "wrap"]);
  expect(overflowOf(container, "country")).toEqual(["visible", "visible", "visible"]);
  expect(overflowOf(container, "status")).toEqual([null, null, null]);
});

test("without overflow no cell carries the attribute", () => {
  const container = renderTable(BASELINE_COLUMNS);
  expect(container.querySelector("[data-overflow]")).toBeNull();
});

test("the overflow lands on the cell content, never on the cell or the header", () => {
  const container = renderTable(withOverflow("wrap"));
  expect(container.querySelector('td[data-column-id="name"]')).not.toHaveAttribute("data-overflow");
  expect(container.querySelector('th[data-column-id="name"] [data-overflow]')).toBeNull();
  expect(container.querySelector('td[data-column-id="_actions"] [data-overflow]')).toBeNull();
});
