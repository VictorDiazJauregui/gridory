import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import { DataTable, type DataTableProps } from "../components/table";
import { buildCompanyColumns } from "../components/mocks/company/company-columns";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../components/mocks/company/company-rows";
import { getOptionByName } from "./option-queries";

// The events a table without the 1.2.0 controlled props emits, recorded on staging before
// controlled filters, paging and search existed: they must stay exactly the same.

type EventEntry = [name: string, payload: unknown];

const COLUMNS = buildCompanyColumns({ appsWidth: 200, statusSearchable: false });

const buildRecorder = () => {
  const events: EventEntry[] = [];
  const record = (name: string) => (payload: unknown) => events.push([name, payload]);
  const props: Partial<DataTableProps<MockCompanyRow>> = {
    onPaginationChange: record("onPaginationChange"),
    onSearchChange: record("onSearchChange"),
    onSortChange: record("onSortChange"),
    onGroupChange: record("onGroupChange"),
  };
  return { events, props };
};

const nextPage = (container: HTMLElement) =>
  fireEvent.click(container.querySelectorAll(".gdy-table-pagination-right .gdy-icon-btn")[1]);

const typeSearch = (value: string) => fireEvent.change(screen.getByRole("searchbox"), { target: { value } });

const pageText = (container: HTMLElement) =>
  container.querySelector(".gdy-table-pagination-right .gdy-table-pagination-text")?.textContent;

const filterStatusActive = (container: HTMLElement) => {
  fireEvent.click(screen.getByRole("button", { name: "Estado" }));
  const panel = container.querySelector(".gdy-panel") as HTMLElement;
  fireEvent.click(within(panel).getByText("Activa"));
  fireEvent.keyDown(document, { key: "Escape" });
};

const changePageSize = (size: string) => {
  fireEvent.click(screen.getByRole("combobox", { name: "Elementos por página" }));
  fireEvent.click(getOptionByName(size));
};

const searchAndFilterFromPageTwo = (container: HTMLElement) => {
  nextPage(container);
  typeSearch("a");
  expect(pageText(container)).toMatch(/^Página 1 de/);
  typeSearch("");
  nextPage(container);
  filterStatusActive(container);
  expect(pageText(container)).toMatch(/^Página 1 de/);
  fireEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));
};

test("client-side table: the page resets stay silent and only the user changes are reported", () => {
  const { events, props } = buildRecorder();
  const { container, rerender } = render(
    <DataTable columns={COLUMNS} data={MOCK_COMPANY_ROWS} defaultPageSize={10} {...props} />,
  );
  searchAndFilterFromPageTwo(container);
  changePageSize("25");
  nextPage(container);
  rerender(<DataTable columns={COLUMNS} data={MOCK_COMPANY_ROWS.slice(0, 10)} defaultPageSize={10} {...props} />);
  expect(pageText(container)).toBe("Página 1 de 1");
  expect(events).toEqual([
    ["onPaginationChange", { pageIndex: 1, pageSize: 10 }],
    ["onSearchChange", "a"],
    ["onSearchChange", ""],
    ["onPaginationChange", { pageIndex: 1, pageSize: 10 }],
    ["onPaginationChange", { pageIndex: 0, pageSize: 25 }],
    ["onPaginationChange", { pageIndex: 1, pageSize: 25 }],
  ]);
});

test("server-side table: searching goes back to page 1 without reporting the page", () => {
  const { events, props } = buildRecorder();
  const { container } = render(
    <DataTable
      columns={COLUMNS}
      data={MOCK_COMPANY_ROWS.slice(0, 10)}
      manualPagination
      serverRowCount={MOCK_COMPANY_ROWS.length}
      defaultPageSize={10}
      {...props}
    />,
  );
  nextPage(container);
  typeSearch("x");
  expect(pageText(container)).toBe(`Página 1 de ${Math.ceil(MOCK_COMPANY_ROWS.length / 10)}`);
  expect(events).toEqual([
    ["onPaginationChange", { pageIndex: 1, pageSize: 10 }],
    ["onSearchChange", "x"],
  ]);
});
