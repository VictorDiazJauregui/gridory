import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { DataTable, type ColumnDefinition, type ColumnFooterContext, type DataTableProps } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROW_ACTIONS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type TableProps = Partial<DataTableProps<BaselineRow>>;

const countFooter = ({ pageRows, filteredRows, totalRows }: ColumnFooterContext<BaselineRow>) =>
  `${pageRows.length}/${filteredRows.length}/${totalRows}`;

const FOOTER_COLUMNS: ColumnDefinition<BaselineRow>[] = BASELINE_COLUMNS.map((column) => {
  if (column.id === "name") return { ...column, footer: () => "Total" };
  if (column.id === "status") return { ...column, align: "right", footer: countFooter };
  return column;
});

const renderTable = (props: TableProps = {}) =>
  render(<DataTable columns={FOOTER_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />).container;

const footCells = (container: HTMLElement) => [...container.querySelectorAll("tfoot.gdy-table-foot td")];

const footCell = (container: HTMLElement, columnId: string) =>
  container.querySelector(`tfoot td[data-column-id="${columnId}"]`);

test("without footer there is no tfoot", () => {
  const container = render(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} />).container;
  expect(container.querySelector("tfoot")).toBeNull();
});

test("renders one foot cell per visible column, with the column id and alignment", () => {
  const container = renderTable({ rowActions: BASELINE_ROW_ACTIONS });
  expect(footCells(container).map((cell) => cell.getAttribute("data-column-id"))).toEqual(["name", "country", "status", "_actions"]);
  expect(footCell(container, "name")).toHaveTextContent("Total");
  expect(footCell(container, "status")).toHaveAttribute("data-align", "right");
  expect(footCell(container, "country")).toBeEmptyDOMElement();
  expect(footCell(container, "_actions")).toBeEmptyDOMElement();
  expect(footCells(container).every((cell) => cell.className === "gdy-table-foot-cell")).toBe(true);
});

test("the totals follow the search", () => {
  const container = renderTable();
  expect(footCell(container, "status")).toHaveTextContent("3/3/3");
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Frio" } });
  expect(footCell(container, "status")).toHaveTextContent("1/1/1");
});

test("the totals follow the filters", () => {
  const container = renderTable();
  fireEvent.click(screen.getByRole("button", { name: "Estado" }));
  fireEvent.click(within(container.querySelector(".gdy-panel") as HTMLElement).getByText("Activa"));
  expect(footCell(container, "status")).toHaveTextContent("2/2/2");
});

test("pageRows is the page and filteredRows every filtered row", () => {
  const container = renderTable({ defaultPageSize: 2, pageSizeOptions: [2] });
  expect(footCell(container, "status")).toHaveTextContent("2/3/3");
});

test("with manualPagination totalRows is serverRowCount", () => {
  const container = renderTable({ manualPagination: true, serverRowCount: 40 });
  expect(footCell(container, "status")).toHaveTextContent("3/3/40");
});

test("the grouped column leaves the foot row too", () => {
  const container = renderTable({ groupableColumnIds: ["country"], defaultGroupBy: "country" });
  expect(footCells(container).map((cell) => cell.getAttribute("data-column-id"))).toEqual(["name", "status"]);
});

test("there is no tfoot when the only footer column is grouped", () => {
  const columns = BASELINE_COLUMNS.map((column) => (column.id === "status" ? { ...column, footer: countFooter } : column));
  const { container } = render(<DataTable columns={columns} data={BASELINE_ROWS} groupableColumnIds={["status"]} defaultGroupBy="status" />);
  expect(container.querySelector("tfoot")).toBeNull();
});

test("while loading the cells with footer show a placeholder and footer is not called", () => {
  const footer = vi.fn(() => "Total");
  const columns = BASELINE_COLUMNS.map((column) => (column.id === "name" ? { ...column, footer } : column));
  const { container } = render(<DataTable columns={columns} data={BASELINE_ROWS} loading />);
  expect(footCell(container, "name")?.querySelector(".gdy-skeleton")).not.toBeNull();
  expect(footCell(container, "country")?.querySelector(".gdy-skeleton")).toBeNull();
  expect(footer).not.toHaveBeenCalled();
});

test("classNames.foot and classNames.footCell go after their hooks", () => {
  const container = renderTable({ classNames: { foot: "x-foot", footCell: "x-foot-cell" } });
  expect(container.querySelector("tfoot")?.className).toBe("gdy-table-foot x-foot");
  expect(footCells(container).map((cell) => cell.className)).toEqual(Array(3).fill("gdy-table-foot-cell x-foot-cell"));
});
