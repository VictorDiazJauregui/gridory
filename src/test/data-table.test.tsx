import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import {
  buildCompanyColumns,
} from "../components/mocks/company/company-columns";
import {
  MOCK_COMPANY_ROWS,
  type MockCompanyRow,
} from "../components/mocks/company/company-rows";
import { DataTable, type DataTableProps } from "../components/table";

type TableProps = Partial<DataTableProps<MockCompanyRow>>;

const COLUMNS = buildCompanyColumns({ appsWidth: 120, statusSearchable: true });
const NO_PAGINATION = { pagination: false };
const STATUS_OPTIONS = ["Activa", "Pendiente", "Archivada"].map((value) => ({
  value,
  label: value,
}));
const STATUS_COUNT = new Set(MOCK_COMPANY_ROWS.map((row) => row.status)).size;

const renderTable = (props: TableProps = {}) =>
  render(
    <DataTable
      columns={COLUMNS}
      data={MOCK_COMPANY_ROWS}
      getRowId={(row) => row.id}
      features={NO_PAGINATION}
      {...props}
    />,
  );

const dataRows = (container: HTMLElement) =>
  container.querySelectorAll(".gdy-table-row");

const groupRows = (container: HTMLElement) =>
  container.querySelectorAll(".gdy-table-group-row");

const rowNames = (container: HTMLElement) =>
  [...dataRows(container)].map(
    (row) => row.querySelector(".gdy-table-cell")?.textContent,
  );

const sortedNames = () =>
  MOCK_COMPANY_ROWS.map((row) => row.name).sort((a, b) => a.localeCompare(b));

const countRows = (predicate: (row: MockCompanyRow) => boolean) =>
  MOCK_COMPANY_ROWS.filter(predicate).length;

const withColumn = (id: string, patch: Partial<(typeof COLUMNS)[number]>) =>
  COLUMNS.map((column) =>
    column.id === id ? { ...column, ...patch } : column,
  );

test("renders the headers and one row per record", () => {
  const { container } = renderTable();
  expect(container.querySelector(".gdy-table")).toBeInTheDocument();
  ["Empresa", "Marca", "País", "Apps", "Estado"].forEach((header) => {
    expect(screen.getByRole("button", { name: header })).toBeInTheDocument();
  });
  expect(dataRows(container)).toHaveLength(MOCK_COMPANY_ROWS.length);
});

test("narrows the rows to the records matching the search", async () => {
  const user = userEvent.setup();
  const { container } = renderTable();
  await user.type(screen.getByRole("searchbox"), "Frio Delta");
  expect(rowNames(container)).toEqual(["Frio Delta"]);
});

test("shows the empty message when nothing matches", async () => {
  const user = userEvent.setup();
  const { container } = renderTable({ emptyMessage: "Sin coincidencias" });
  await user.type(screen.getByRole("searchbox"), "zzzz");
  expect(dataRows(container)).toHaveLength(0);
  expect(screen.getByText("Sin coincidencias")).toHaveClass("gdy-empty");
});

test("sorts from the column menu and marks the active direction", () => {
  const { container } = renderTable();
  fireEvent.click(screen.getByRole("button", { name: "Empresa" }));
  const ascending = screen.getByRole("button", { name: /Ascendente/ });
  fireEvent.click(ascending);
  expect(ascending).toHaveAttribute("aria-pressed", "true");
  expect(rowNames(container)[0]).toBe(sortedNames()[0]);
  fireEvent.click(screen.getByRole("button", { name: /Descendente/ }));
  expect(ascending).toHaveAttribute("aria-pressed", "false");
  expect(rowNames(container)[0]).toBe(sortedNames().at(-1));
});

test("cycles the sort of a non-filterable column: asc, desc, none", () => {
  const { container } = renderTable({
    columns: withColumn("name", { filterable: false }),
  });
  const initial = rowNames(container);
  const header = screen.getByRole("button", { name: "Empresa" });
  fireEvent.click(header);
  expect(rowNames(container)[0]).toBe(sortedNames()[0]);
  fireEvent.click(header);
  expect(rowNames(container)[0]).toBe(sortedNames().at(-1));
  fireEvent.click(header);
  expect(rowNames(container)).toEqual(initial);
});

test("filters by value and clears from the toolbar", () => {
  const { container } = renderTable();
  const trigger = screen.getByRole("button", { name: "Estado" });
  fireEvent.click(trigger);
  const panel = container.querySelector(".gdy-panel") as HTMLElement;
  fireEvent.click(within(panel).getByText("Activa"));
  expect(within(panel).getByText("Activa").closest(".gdy-option-item"))
    .toHaveAttribute("data-selected");
  expect(trigger).toHaveAttribute("data-filtered");
  expect(dataRows(container)).toHaveLength(
    countRows((row) => row.status === "Activa"),
  );
  fireEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));
  expect(trigger).not.toHaveAttribute("data-filtered");
  expect(dataRows(container)).toHaveLength(MOCK_COMPANY_ROWS.length);
});

test("marks the rows as clickable and reports the clicked record", () => {
  const onRowClick = vi.fn();
  const { container } = renderTable({ onRowClick });
  const [firstRow] = dataRows(container);
  expect(firstRow).toHaveAttribute("data-clickable");
  fireEvent.click(firstRow);
  expect(onRowClick).toHaveBeenCalledWith(MOCK_COMPANY_ROWS[0]);
});

test("groups the rows and collapses a group from its toggle", () => {
  const { container } = renderTable({
    features: { ...NO_PAGINATION, grouping: true },
    groupableColumnIds: ["status"],
    defaultGroupBy: "status",
  });
  const toggle = () =>
    container.querySelector(".gdy-table-group-toggle") as HTMLElement;
  const groupSize = Number(
    toggle().querySelector(".gdy-table-group-count")?.textContent,
  );
  expect(groupRows(container)).toHaveLength(STATUS_COUNT);
  expect(toggle()).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(toggle());
  expect(toggle()).toHaveAttribute("aria-expanded", "false");
  expect(dataRows(container)).toHaveLength(
    MOCK_COMPANY_ROWS.length - groupSize,
  );
});

test("paginates with the given page size and steps to the next page", () => {
  const { container } = renderTable({ features: {}, defaultPageSize: 5 });
  const pageCount = Math.ceil(MOCK_COMPANY_ROWS.length / 5);
  expect(dataRows(container)).toHaveLength(5);
  expect(screen.getByText(`Página 1 de ${pageCount}`)).toBeInTheDocument();
  const [, next] = container.querySelectorAll(
    ".gdy-table-pagination-right .gdy-icon-btn",
  );
  fireEvent.click(next);
  expect(screen.getByText(`Página 2 de ${pageCount}`)).toBeInTheDocument();
  expect(rowNames(container)[0]).toBe(MOCK_COMPANY_ROWS[5].name);
});

test("applies the style hooks passed as props", () => {
  const { container } = renderTable({
    thinScrollbars: true,
    scrollbarColor: "#123456",
    optionHoverColor: "#abcdef",
  });
  const root = container.querySelector(".gdy-table") as HTMLElement;
  expect(root).toHaveClass("gdy-thin-scroll");
  expect(root.style.getPropertyValue("--gdy-scrollbar-thumb")).toBe("#123456");
  expect(root.style.getPropertyValue("--gdy-option-hover-bg")).toBe("#abcdef");
});

test("edits a cell inline through its select", async () => {
  const user = userEvent.setup();
  const onInlineEdit = vi.fn();
  const { container } = renderTable({
    columns: withColumn("status", {
      inlineEditOptions: STATUS_OPTIONS,
      onInlineEdit,
    }),
  });
  const trigger = container.querySelector(
    ".gdy-table-inline-select",
  ) as HTMLElement;
  expect(trigger).toHaveTextContent(MOCK_COMPANY_ROWS[0].status);
  await user.click(trigger);
  await user.click(await screen.findByRole("option", { name: "Pendiente" }));
  expect(onInlineEdit).toHaveBeenCalledWith(MOCK_COMPANY_ROWS[0], "Pendiente");
});
