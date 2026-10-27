import { useState } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { DataTable, type DataTableProps } from "../components/table";
import type { ColumnSortingState } from "../components/shared/data-model";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type TableProps = Partial<DataTableProps<BaselineRow>>;

const renderTable = (props: TableProps = {}) =>
  render(
    <DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />,
  );

const rowNames = (container: HTMLElement) =>
  [...container.querySelectorAll("tbody tr.gdy-table-row")].map((row) => row.querySelector("td")?.textContent);

const clickHeader = (name: string) => fireEvent.click(screen.getByRole("button", { name }));

const ascendingByName: ColumnSortingState = { id: "name", direction: "asc" };

test("applies a sort that comes from outside", () => {
  const { container, rerender } = renderTable({ sorting: ascendingByName });
  expect(rowNames(container)).toEqual(["Cold South", "Frío Delta", "Pack Norte"]);
  rerender(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} sorting={null} />);
  expect(rowNames(container)).toEqual(["Frío Delta", "Pack Norte", "Cold South"]);
});

test("reports each step of the header cycle without changing a controlled sort", () => {
  const onSortChange = vi.fn();
  const { container } = renderTable({ sorting: null, onSortChange });
  clickHeader("Empresa");
  expect(onSortChange).toHaveBeenLastCalledWith(ascendingByName);
  expect(rowNames(container)).toEqual(["Frío Delta", "Pack Norte", "Cold South"]);
});

const ControlledTable = ({ onSortChange }: { onSortChange: (sorting: ColumnSortingState | null) => void }) => {
  const [sorting, setSorting] = useState<ColumnSortingState | null>(null);
  const handleSortChange = (next: ColumnSortingState | null) => {
    setSorting(next);
    onSortChange(next);
  };
  return <DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} sorting={sorting} onSortChange={handleSortChange} />;
};

test("a controlled table walks the cycle asc, desc, none", () => {
  const onSortChange = vi.fn();
  render(<ControlledTable onSortChange={onSortChange} />);
  ["Empresa", "Empresa", "Empresa"].forEach(clickHeader);
  expect(onSortChange.mock.calls.map(([sorting]) => sorting)).toEqual([
    ascendingByName,
    { id: "name", direction: "desc" },
    null,
  ]);
});

test("uncontrolled, it still sorts and reports the change", () => {
  const onSortChange = vi.fn();
  const { container } = renderTable({ onSortChange });
  clickHeader("Empresa");
  expect(onSortChange).toHaveBeenCalledWith(ascendingByName);
  expect(rowNames(container)[0]).toBe("Cold South");
});

test("reports the sort chosen in the filter menu", () => {
  const onSortChange = vi.fn();
  renderTable({ onSortChange });
  clickHeader("Estado");
  fireEvent.click(screen.getByRole("button", { name: /Descendente/ }));
  expect(onSortChange).toHaveBeenCalledWith({ id: "status", direction: "desc" });
});

test("manualSorting never reorders the rows locally", () => {
  const onSortChange = vi.fn();
  const { container } = renderTable({ manualSorting: true, onSortChange });
  clickHeader("Empresa");
  expect(onSortChange).toHaveBeenCalledWith(ascendingByName);
  expect(rowNames(container)).toEqual(["Frío Delta", "Pack Norte", "Cold South"]);
});

const manualPageProps = (onPaginationChange: () => void): TableProps => ({
  manualPagination: true,
  manualSorting: true,
  serverRowCount: 9,
  defaultPageSize: 3,
  onPaginationChange,
});

test("with manualSorting a sort change goes back to page 1 and reports it", () => {
  const onPaginationChange = vi.fn();
  const { container } = renderTable(manualPageProps(onPaginationChange));
  fireEvent.click([...container.querySelectorAll(".gdy-table-pagination button")].at(-1) as Element);
  onPaginationChange.mockClear();
  clickHeader("Empresa");
  expect(onPaginationChange).toHaveBeenCalledExactlyOnceWith({ pageIndex: 0, pageSize: 3 });
  expect(container.querySelector(".gdy-table-pagination")?.textContent).toContain("1");
});

test("with manualSorting on page 1 a sort change does not report the page again", () => {
  const onPaginationChange = vi.fn();
  renderTable(manualPageProps(onPaginationChange));
  clickHeader("Empresa");
  expect(onPaginationChange).not.toHaveBeenCalled();
});

test("without the new props the sort works as in 1.1.0", () => {
  const { container } = renderTable();
  clickHeader("Empresa");
  expect(rowNames(container)[0]).toBe("Cold South");
  clickHeader("Empresa");
  expect(rowNames(container)[0]).toBe("Pack Norte");
  clickHeader("Empresa");
  expect(rowNames(container)).toEqual(["Frío Delta", "Pack Norte", "Cold South"]);
});
