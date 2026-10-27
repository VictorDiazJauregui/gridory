import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { DataTable, type ColumnFiltersState, type DataTableProps } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type TableProps = Partial<DataTableProps<BaselineRow>>;

const renderTable = (props: TableProps = {}) =>
  render(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />);

const rowNames = (container: HTMLElement) =>
  [...container.querySelectorAll("tbody tr.gdy-table-row")].map((row) => row.querySelector("td")?.textContent);

const openFilter = (container: HTMLElement, header: string) => {
  fireEvent.click(screen.getByRole("button", { name: header }));
  return container.querySelector(".gdy-panel") as HTMLElement;
};

const pickValue = (container: HTMLElement, header: string, value: string) =>
  fireEvent.click(within(openFilter(container, header)).getByText(value));

const optionLabels = (panel: HTMLElement) =>
  [...panel.querySelectorAll(".gdy-option-item")].map((option) => option.textContent?.trim());

const activeOnly: ColumnFiltersState = { values: { status: ["Activa"] }, dates: {} };

test("applies filters that come from outside", () => {
  const { container, rerender } = renderTable({ columnFilters: activeOnly });
  expect(rowNames(container)).toEqual(["Frío Delta", "Cold South"]);
  expect(screen.getByRole("button", { name: "Estado" })).toHaveAttribute("data-filtered");
  rerender(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} columnFilters={{ values: {}, dates: {} }} />);
  expect(rowNames(container)).toHaveLength(3);
});

test("reports the selection without changing controlled filters", () => {
  const onFiltersChange = vi.fn();
  const { container } = renderTable({ columnFilters: { values: {}, dates: {} }, onFiltersChange });
  pickValue(container, "Estado", "Activa");
  expect(onFiltersChange).toHaveBeenCalledExactlyOnceWith(activeOnly);
  expect(rowNames(container)).toHaveLength(3);
});

const ControlledTable = ({ onFiltersChange }: { onFiltersChange: (filters: ColumnFiltersState) => void }) => {
  const [filters, setFilters] = useState<ColumnFiltersState>({ values: {}, dates: {} });
  const handleChange = (next: ColumnFiltersState) => {
    setFilters(next);
    onFiltersChange(next);
  };
  return <DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} columnFilters={filters} onFiltersChange={handleChange} />;
};

test("a controlled table filters, unselects and clears through the event", () => {
  const onFiltersChange = vi.fn();
  const { container } = render(<ControlledTable onFiltersChange={onFiltersChange} />);
  pickValue(container, "Estado", "Activa");
  expect(rowNames(container)).toEqual(["Frío Delta", "Cold South"]);
  fireEvent.click(within(container.querySelector(".gdy-panel") as HTMLElement).getByText("Activa"));
  expect(onFiltersChange).toHaveBeenLastCalledWith({ values: {}, dates: {} });
  fireEvent.click(screen.getByRole("button", { name: "Estado" }));
  pickValue(container, "Estado", "Activa");
  fireEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));
  expect(onFiltersChange).toHaveBeenLastCalledWith({ values: {}, dates: {} });
  expect(rowNames(container)).toHaveLength(3);
});

test("uncontrolled, it still filters and reports only the active filters", () => {
  const onFiltersChange = vi.fn();
  const { container } = renderTable({ onFiltersChange });
  pickValue(container, "Estado", "Activa");
  pickValue(container, "País", "Perú");
  expect(onFiltersChange).toHaveBeenLastCalledWith({ values: { status: ["Activa"], country: ["Perú"] }, dates: {} });
  expect(rowNames(container)).toEqual(["Frío Delta"]);
});

test("manualFiltering never filters the rows locally", () => {
  const onFiltersChange = vi.fn();
  const { container } = renderTable({ manualFiltering: true, onFiltersChange });
  pickValue(container, "Estado", "Activa");
  expect(onFiltersChange).toHaveBeenCalledWith(activeOnly);
  expect(rowNames(container)).toHaveLength(3);
});

test("with manualFiltering the menu keeps a selected value the loaded rows no longer have", () => {
  const { container } = renderTable({ manualFiltering: true, columnFilters: { values: { status: ["Pendiente"] }, dates: {} } });
  expect(optionLabels(openFilter(container, "Estado"))).toEqual(["Activa", "Archivada", "Pendiente"]);
});

test("with manualFiltering the column filterOptions are listed as given", () => {
  const columns = BASELINE_COLUMNS.map((column) =>
    column.id === "status" ? { ...column, filterOptions: [{ value: "Activa", label: "Activa" }] } : column,
  );
  const { container } = renderTable({ columns, manualFiltering: true });
  expect(optionLabels(openFilter(container, "Estado"))).toEqual(["Activa"]);
});

const manualPageProps = (onPaginationChange: () => void): TableProps => ({
  manualPagination: true,
  manualFiltering: true,
  serverRowCount: 9,
  defaultPageSize: 3,
  onPaginationChange,
});

test("with manualFiltering a filter change goes back to page 1 and reports it", () => {
  const onPaginationChange = vi.fn();
  const { container } = renderTable(manualPageProps(onPaginationChange));
  fireEvent.click([...container.querySelectorAll(".gdy-table-pagination button")].at(-1) as Element);
  onPaginationChange.mockClear();
  pickValue(container, "Estado", "Activa");
  expect(onPaginationChange).toHaveBeenCalledExactlyOnceWith({ pageIndex: 0, pageSize: 3 });
});

test("with manualFiltering on page 1 a filter change does not report the page again", () => {
  const onPaginationChange = vi.fn();
  const { container } = renderTable(manualPageProps(onPaginationChange));
  pickValue(container, "Estado", "Activa");
  expect(onPaginationChange).not.toHaveBeenCalled();
});

const DATE_COLUMNS = [
  ...BASELINE_COLUMNS,
  { id: "since", header: "Alta", accessor: () => "2026-01-15", type: "date" as const, filterable: true },
];

test("an incomplete date filter (operator without a date) is not reported", () => {
  const onFiltersChange = vi.fn();
  const { container } = renderTable({ columns: DATE_COLUMNS, onFiltersChange });
  const panel = openFilter(container, "Alta");
  fireEvent.click(within(panel).getByText("Mayor que (fecha posterior)"));
  fireEvent.click(within(panel).getByText("Aplicar"));
  expect(onFiltersChange).not.toHaveBeenCalled();
});

test("a controlled date filter is applied and reported back as given", () => {
  const since: ColumnFiltersState = { values: {}, dates: { since: { op: "gt", date: "2026-02-01", dateFrom: "", dateTo: "" } } };
  const { container } = renderTable({ columns: DATE_COLUMNS, columnFilters: since });
  expect(rowNames(container)).toEqual([]);
  expect(screen.getByRole("button", { name: "Alta" })).toHaveAttribute("data-filtered");
});
