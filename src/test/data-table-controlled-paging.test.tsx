import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { DataTable, type DataTableProps, type ManualPaginationState } from "../components/table";
import { buildCompanyColumns } from "../components/mocks/company/company-columns";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../components/mocks/company/company-rows";
import { getOptionByName } from "./option-queries";

type TableProps = Partial<DataTableProps<MockCompanyRow>>;

const COLUMNS = buildCompanyColumns({ appsWidth: 200, statusSearchable: false });
const PAGE_COUNT = Math.ceil(MOCK_COMPANY_ROWS.length / 10);

const tableElement = (props: TableProps) => (
  <DataTable columns={COLUMNS} data={MOCK_COMPANY_ROWS} getRowId={(row) => row.id} defaultPageSize={10} {...props} />
);

const pageText = (container: HTMLElement) =>
  container.querySelector(".gdy-table-pagination-right .gdy-table-pagination-text")?.textContent;

const firstRowName = (container: HTMLElement) => container.querySelector("tbody tr.gdy-table-row td")?.textContent;

const nextPage = (container: HTMLElement) =>
  fireEvent.click(container.querySelectorAll(".gdy-table-pagination-right .gdy-icon-btn")[1]);

test("shows the page that comes from outside and goes back to page 1 without remounting", () => {
  const { container, rerender } = render(tableElement({ pageIndex: 2 }));
  const root = container.querySelector(".gdy-table");
  expect(pageText(container)).toBe(`Página 3 de ${PAGE_COUNT}`);
  expect(firstRowName(container)).toBe(MOCK_COMPANY_ROWS[20].name);
  rerender(tableElement({ pageIndex: 0 }));
  expect(pageText(container)).toBe(`Página 1 de ${PAGE_COUNT}`);
  expect(container.querySelector(".gdy-table")).toBe(root);
});

test("a controlled page only reports the arrows and does not report on mount", () => {
  const onPaginationChange = vi.fn();
  const { container } = render(tableElement({ pageIndex: 1, onPaginationChange }));
  expect(onPaginationChange).not.toHaveBeenCalled();
  nextPage(container);
  expect(onPaginationChange).toHaveBeenCalledExactlyOnceWith({ pageIndex: 2, pageSize: 10 });
  expect(pageText(container)).toBe(`Página 2 de ${PAGE_COUNT}`);
});

test("an out of range page shows the last one and reports the fix once", () => {
  const onPaginationChange = vi.fn();
  const { container, rerender } = render(tableElement({ pageIndex: 40, onPaginationChange }));
  expect(pageText(container)).toBe(`Página ${PAGE_COUNT} de ${PAGE_COUNT}`);
  rerender(tableElement({ pageIndex: 40, onPaginationChange }));
  expect(onPaginationChange).toHaveBeenCalledExactlyOnceWith({ pageIndex: PAGE_COUNT - 1, pageSize: 10 });
});

test("an out of range page is not reported while loading", () => {
  const onPaginationChange = vi.fn();
  render(tableElement({ pageIndex: 40, loading: true, onPaginationChange }));
  expect(onPaginationChange).not.toHaveBeenCalled();
});

const ControlledPageTable = (props: TableProps & { onReport: (state: ManualPaginationState) => void }) => {
  const [page, setPage] = useState({ pageIndex: 2, pageSize: 10 });
  const handleChange = (next: ManualPaginationState) => {
    setPage(next);
    props.onReport(next);
  };
  return tableElement({ ...props, ...page, onPaginationChange: handleChange });
};

test("with a controlled page every automatic return to page 1 is reported", () => {
  const onReport = vi.fn();
  const { container } = render(<ControlledPageTable onReport={onReport} />);
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "a" } });
  expect(onReport).toHaveBeenLastCalledWith({ pageIndex: 0, pageSize: 10 });
  expect(pageText(container)).toMatch(/^Página 1 de/);
});

test("with a controlled page a filter change reports the first page", () => {
  const onReport = vi.fn();
  const { container } = render(<ControlledPageTable onReport={onReport} />);
  fireEvent.click(screen.getByRole("button", { name: "Estado" }));
  fireEvent.click(within(container.querySelector(".gdy-panel") as HTMLElement).getByText("Activa"));
  expect(onReport).toHaveBeenCalledExactlyOnceWith({ pageIndex: 0, pageSize: 10 });
});

test("a page size set from outside shows that many rows and goes back to page 1", () => {
  const { container, rerender } = render(tableElement({ pageSize: 10 }));
  nextPage(container);
  rerender(tableElement({ pageSize: 25 }));
  expect(container.querySelectorAll("tbody tr.gdy-table-row")).toHaveLength(25);
  expect(pageText(container)).toBe(`Página 1 de ${Math.ceil(MOCK_COMPANY_ROWS.length / 25)}`);
});

test("a page size set from outside reports the first page when the page is controlled", () => {
  const onPaginationChange = vi.fn();
  const { rerender } = render(tableElement({ pageIndex: 2, pageSize: 10, onPaginationChange }));
  rerender(tableElement({ pageIndex: 2, pageSize: 25, onPaginationChange }));
  expect(onPaginationChange).toHaveBeenCalledExactlyOnceWith({ pageIndex: 0, pageSize: 25 });
});

test("a controlled page size missing from the options is listed in the select", () => {
  render(tableElement({ pageSize: 13, pageSizeOptions: [10, 25] }));
  const select = screen.getByRole("combobox", { name: "Elementos por página" });
  expect(select).toHaveTextContent("13");
  fireEvent.click(select);
  expect(getOptionByName("13")).toBeInTheDocument();
});

test("an uncontrolled default size missing from the options is not added", () => {
  render(tableElement({ defaultPageSize: 13, pageSizeOptions: [10, 25] }));
  fireEvent.click(screen.getByRole("combobox", { name: "Elementos por página" }));
  expect(screen.queryAllByRole("option").map((option) => option.textContent)).toEqual(["10", "25"]);
});
