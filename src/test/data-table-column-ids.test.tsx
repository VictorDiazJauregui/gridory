import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, BASELINE_ROW_ACTIONS } from "./baseline-fixture";

const renderTable = (columns = BASELINE_COLUMNS) =>
  render(
    <DataTable
      columns={columns}
      data={BASELINE_ROWS}
      getRowId={(row) => row.id}
      rowActions={BASELINE_ROW_ACTIONS}
      groupableColumnIds={["status"]}
    />,
  );

const columnIdsOf = (row: Element | null) =>
  [...(row?.children ?? [])].map((cell) => cell.getAttribute("data-column-id"));

const headerIds = (container: HTMLElement) =>
  columnIdsOf(container.querySelector(".gdy-table-head-row"));

const COLUMN_IDS = ["name", "country", "status", "_actions"];

test("every header and data cell carries the id of its column, actions included", () => {
  const { container } = renderTable();
  expect(headerIds(container)).toEqual(COLUMN_IDS);
  container.querySelectorAll(".gdy-table-row").forEach((row) => {
    expect(columnIdsOf(row)).toEqual(COLUMN_IDS);
  });
});

test("the attribute follows the column when the columns are reordered", () => {
  const { container, rerender } = renderTable();
  const reordered = [...BASELINE_COLUMNS].reverse();
  rerender(
    <DataTable
      columns={reordered}
      data={BASELINE_ROWS}
      getRowId={(row) => row.id}
      rowActions={BASELINE_ROW_ACTIONS}
    />,
  );
  const expected = ["status", "country", "name", "_actions"];
  expect(headerIds(container)).toEqual(expected);
  const firstRow = container.querySelector(".gdy-table-row");
  expect(columnIdsOf(firstRow)).toEqual(expected);
  expect(firstRow?.querySelector('[data-column-id="name"]')).toHaveTextContent(BASELINE_ROWS[0].name);
});

test("the group row and the empty cell carry no column id", () => {
  const { container } = renderTable();
  fireEvent.click(screen.getByRole("combobox", { name: "Agrupar por" }));
  fireEvent.click(screen.getByRole("option", { name: "Agrupar por: Estado" }));
  expect(container.querySelector(".gdy-table-group-cell")).not.toHaveAttribute("data-column-id");
  expect(headerIds(container)).toEqual(["name", "country", "_actions"]);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "sin coincidencias" } });
  expect(container.querySelector(".gdy-table-cell.gdy-empty")).not.toHaveAttribute("data-column-id");
});
