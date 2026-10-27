import { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { DataTable, type DataTableProps } from "../components/table";
import { buildCompanyColumns } from "../components/mocks/company/company-columns";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../components/mocks/company/company-rows";

type TableProps = Partial<DataTableProps<MockCompanyRow>>;

const COLUMNS = buildCompanyColumns({ appsWidth: 200, statusSearchable: false });

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

const tableElement = (props: TableProps) => (
  <DataTable columns={COLUMNS} data={MOCK_COMPANY_ROWS} getRowId={(row) => row.id} defaultPageSize={10} {...props} />
);

const searchBox = () => screen.getByRole("searchbox") as HTMLInputElement;

const typeSearch = (value: string) => fireEvent.change(searchBox(), { target: { value } });

const rowCount = (container: HTMLElement) => container.querySelectorAll("tbody tr.gdy-table-row").length;

const pageText = (container: HTMLElement) =>
  container.querySelector(".gdy-table-pagination-right .gdy-table-pagination-text")?.textContent;

test("a controlled search fills the box, filters and only reports what the user types", () => {
  const onSearchChange = vi.fn();
  const { container, rerender } = render(tableElement({ search: "Frio Delta", onSearchChange }));
  expect(searchBox().value).toBe("Frio Delta");
  expect(rowCount(container)).toBe(1);
  rerender(tableElement({ search: "", onSearchChange }));
  expect(onSearchChange).not.toHaveBeenCalled();
  typeSearch("Cold");
  expect(onSearchChange).toHaveBeenCalledExactlyOnceWith("Cold");
  expect(searchBox().value).toBe("");
});

test("searchDebounceMs reports once, with the last value, after the pause", () => {
  const onSearchChange = vi.fn();
  const { container } = render(tableElement({ searchDebounceMs: 300, onSearchChange }));
  ["F", "Fr", "Frio Delta"].forEach(typeSearch);
  expect(searchBox().value).toBe("Frio Delta");
  expect(rowCount(container)).toBe(1);
  act(() => vi.advanceTimersByTime(299));
  expect(onSearchChange).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(1));
  expect(onSearchChange).toHaveBeenCalledExactlyOnceWith("Frio Delta");
});

test("a pending report is dropped when the table unmounts", () => {
  const onSearchChange = vi.fn();
  const { unmount } = render(tableElement({ searchDebounceMs: 300, onSearchChange }));
  typeSearch("Frio");
  unmount();
  act(() => vi.advanceTimersByTime(300));
  expect(onSearchChange).not.toHaveBeenCalled();
});

test("with a debounce, a search the app sets replaces the box and drops the pending report", () => {
  const onSearchChange = vi.fn();
  const { rerender } = render(tableElement({ search: "", searchDebounceMs: 300, onSearchChange }));
  typeSearch("Frio");
  rerender(tableElement({ search: "Cold", searchDebounceMs: 300, onSearchChange }));
  expect(searchBox().value).toBe("Cold");
  act(() => vi.advanceTimersByTime(300));
  expect(onSearchChange).not.toHaveBeenCalled();
});

const ControlledDebouncedSearch = ({ onSearchChange }: { onSearchChange: (query: string) => void }) => {
  const [search, setSearch] = useState("");
  const handleChange = (query: string) => {
    setSearch(query);
    onSearchChange(query);
  };
  return tableElement({ search, searchDebounceMs: 300, onSearchChange: handleChange });
};

test("with a controlled search and a debounce the box answers at once and keeps typing after the echo", () => {
  const onSearchChange = vi.fn();
  render(<ControlledDebouncedSearch onSearchChange={onSearchChange} />);
  typeSearch("Fr");
  expect(searchBox().value).toBe("Fr");
  act(() => vi.advanceTimersByTime(300));
  typeSearch("Frio");
  expect(searchBox().value).toBe("Frio");
  act(() => vi.advanceTimersByTime(300));
  expect(onSearchChange.mock.calls).toEqual([["Fr"], ["Frio"]]);
});

const serverProps = (onPaginationChange: () => void, onSearchChange: () => void): TableProps => ({
  data: MOCK_COMPANY_ROWS.slice(0, 10),
  manualPagination: true,
  serverRowCount: MOCK_COMPANY_ROWS.length,
  searchDebounceMs: 300,
  onPaginationChange,
  onSearchChange,
});

test("with manualPagination the first page goes with the delayed search report", () => {
  const onPaginationChange = vi.fn();
  const onSearchChange = vi.fn();
  render(tableElement({ ...serverProps(onPaginationChange, onSearchChange), pageIndex: 2 }));
  typeSearch("Frio");
  expect(onPaginationChange).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(300));
  expect(onSearchChange).toHaveBeenCalledExactlyOnceWith("Frio");
  expect(onPaginationChange).toHaveBeenCalledExactlyOnceWith({ pageIndex: 0, pageSize: 10 });
});

test("with manualPagination and an uncontrolled page the page changes when the search is reported", () => {
  const { container } = render(tableElement(serverProps(vi.fn(), vi.fn())));
  fireEvent.click(container.querySelectorAll(".gdy-table-pagination-right .gdy-icon-btn")[1]);
  typeSearch("Frio");
  expect(pageText(container)).toMatch(/^Página 2 de/);
  act(() => vi.advanceTimersByTime(300));
  expect(pageText(container)).toMatch(/^Página 1 de/);
});
