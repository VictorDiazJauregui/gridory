import { StrictMode } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { DataTable, type DataTableProps, type VisibleRowsState } from "../components/table";
import { buildVisibleRowsState, isSameVisibleRows } from "../components/table/model/visible-rows";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type TableProps = Partial<DataTableProps<BaselineRow>>;
type Listener = ReturnType<typeof vi.fn<(state: VisibleRowsState<BaselineRow>) => void>>;

type VisibleRowsHandler = (state: VisibleRowsState<BaselineRow>) => void;

const tableElement = (onVisibleRowsChange: VisibleRowsHandler, props: TableProps = {}) => (
  <DataTable
    columns={BASELINE_COLUMNS}
    data={BASELINE_ROWS}
    getRowId={(row) => row.id}
    onVisibleRowsChange={onVisibleRowsChange}
    {...props}
  />
);

const renderTable = (props: TableProps = {}) => {
  const listener: Listener = vi.fn();
  const view = render(tableElement(listener, props));
  return { listener, ...view };
};

const names = (rows: BaselineRow[]) => rows.map((row) => row.name);

const lastState = (listener: Listener) => listener.mock.lastCall?.[0] as VisibleRowsState<BaselineRow>;

test("reports every row on mount", () => {
  const { listener } = renderTable();
  expect(listener).toHaveBeenCalledTimes(1);
  expect(lastState(listener)).toEqual({ pageRows: BASELINE_ROWS, filteredRows: BASELINE_ROWS, totalRows: 3 });
});

test("reports the rows that match the search, accents ignored", () => {
  const { listener } = renderTable();
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "peru" } });
  expect(names(lastState(listener).filteredRows)).toEqual(["Frío Delta"]);
  expect(lastState(listener).totalRows).toBe(1);
});

test("follows a column filter and the sort", () => {
  const { listener, container } = renderTable();
  fireEvent.click(screen.getByRole("button", { name: "Estado" }));
  const panel = container.querySelector(".gdy-panel") as HTMLElement;
  fireEvent.click(within(panel).getByText("Archivada"));
  expect(names(lastState(listener).filteredRows)).toEqual(["Pack Norte"]);
  fireEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));
  fireEvent.click(screen.getByRole("button", { name: "Empresa" }));
  expect(names(lastState(listener).pageRows)).toEqual(["Cold South", "Frío Delta", "Pack Norte"]);
});

test("pageRows is the current page and filteredRows keeps every row", () => {
  const { listener, container } = renderTable({ defaultPageSize: 2 });
  expect(names(lastState(listener).pageRows)).toEqual(["Frío Delta", "Pack Norte"]);
  expect(lastState(listener).filteredRows).toHaveLength(3);
  const nextPage = [...container.querySelectorAll(".gdy-table-pagination button")].at(-1);
  fireEvent.click(nextPage as Element);
  expect(names(lastState(listener).pageRows)).toEqual(["Cold South"]);
  expect(lastState(listener).totalRows).toBe(3);
});

test("with groups the rows come in screen order, collapsed groups included", () => {
  const { listener, container } = renderTable({ groupableColumnIds: ["status"] });
  fireEvent.click(screen.getByRole("combobox", { name: "Agrupar por" }));
  fireEvent.click(screen.getByRole("option", { name: "Agrupar por: Estado" }));
  const grouped = ["Frío Delta", "Cold South", "Pack Norte"];
  expect(names(lastState(listener).pageRows)).toEqual(grouped);
  fireEvent.click(container.querySelector(".gdy-table-group-toggle") as Element);
  expect(names(lastState(listener).pageRows)).toEqual(grouped);
});

test("without pagination the page is every filtered row", () => {
  const { listener } = renderTable({ features: { pagination: false }, defaultPageSize: 1 });
  expect(lastState(listener).pageRows).toEqual(BASELINE_ROWS);
});

test("in manual mode filteredRows is the received page and totalRows the server count", () => {
  const withCount = renderTable({ manualPagination: true, serverRowCount: 40 });
  expect(lastState(withCount.listener)).toEqual({ pageRows: BASELINE_ROWS, filteredRows: BASELINE_ROWS, totalRows: 40 });
  withCount.unmount();
  const { listener } = renderTable({ manualPagination: true });
  expect(lastState(listener).totalRows).toBe(3);
});

test("never reports the same result twice, with inline columns and handler or under StrictMode", () => {
  const listener: Listener = vi.fn();
  const { rerender } = render(<StrictMode>{tableElement(listener)}</StrictMode>);
  rerender(<StrictMode>{tableElement((state) => listener(state), { columns: [...BASELINE_COLUMNS] })}</StrictMode>);
  expect(listener).toHaveBeenCalledTimes(1);
});

test("isSameVisibleRows compares row by row and the total", () => {
  const state = buildVisibleRowsState({ pageRows: BASELINE_ROWS, filteredRows: BASELINE_ROWS, manualPagination: false });
  expect(isSameVisibleRows(undefined, state)).toBe(false);
  expect(isSameVisibleRows(state, { ...state, pageRows: [...BASELINE_ROWS] })).toBe(true);
  expect(isSameVisibleRows(state, { ...state, pageRows: [...BASELINE_ROWS].reverse() })).toBe(false);
  expect(isSameVisibleRows(state, { ...state, totalRows: 4 })).toBe(false);
});
