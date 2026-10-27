import { fireEvent, render, screen, within } from "@testing-library/react";
import { enUS } from "date-fns/locale";
import { es as dayPickerSpanish } from "react-day-picker/locale";
import { expect, test } from "vitest";
import { buildCompanyColumns } from "../components/mocks/company/company-columns";
import { MOCK_COMPANY_ROWS, type MockCompanyRow } from "../components/mocks/company/company-rows";
import { ENGLISH_TABLE_LABELS } from "../components/mocks/shared/english-labels";
import { TABLE_ROW_ACTIONS } from "../components/mocks/table/table-config";
import { DataTable, type DataTableProps } from "../components/table";

type TableProps = Partial<DataTableProps<MockCompanyRow>>;

const STATUS_OPTIONS = [{ value: "Otra", label: "Otra" }];
const COLUMNS = buildCompanyColumns({ appsWidth: 120, statusSearchable: false }).map((column) =>
  column.id === "status" ? { ...column, inlineEditOptions: STATUS_OPTIONS, onInlineEdit: () => {} } : column,
);

const PAGE_COUNT = Math.ceil(MOCK_COMPANY_ROWS.length / 25);

const renderTable = (props: TableProps = {}) =>
  render(
    <DataTable
      columns={COLUMNS}
      data={MOCK_COMPANY_ROWS}
      getRowId={(row) => row.id}
      rowActions={TABLE_ROW_ACTIONS}
      archivedView={{ defaultValue: "all" }}
      viewSwitch={{ active: "table", onChange: () => {} }}
      aiButton={{ onClick: () => {} }}
      onCreate={() => {}}
      groupableColumnIds={["status"]}
      defaultPageSize={25}
      {...props}
    />,
  ).container;

const renderEnglishTable = (props: TableProps = {}) =>
  renderTable({ labels: ENGLISH_TABLE_LABELS, calendarLocale: enUS, ...props });

const openMenu = (container: HTMLElement, header: string) => {
  fireEvent.click(screen.getByRole("button", { name: header }));
  return container.querySelector(".gdy-panel") as HTMLElement;
};

const openRangeCalendar = (container: HTMLElement, labels: { between: string; pickRange: string }) => {
  const panel = openMenu(container, "Alta");
  fireEvent.click(within(panel).getByText(labels.between));
  fireEvent.click(screen.getByRole("button", { name: labels.pickRange }));
  return document.querySelector(".gdy-calendar-root") as HTMLElement;
};

test("a full English labels object translates the toolbar", () => {
  renderEnglishTable({ createLabel: undefined });
  expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  expect(screen.getByRole("combobox", { name: "Show" })).toHaveTextContent("Show: All");
  expect(screen.getByRole("combobox", { name: "Group by" })).toHaveTextContent("Group by: None");
  expect(screen.getByRole("button", { name: "Table" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Board" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
});

test("a full English labels object translates the pagination", () => {
  const container = renderEnglishTable();
  const pagination = container.querySelector(".gdy-table-pagination") as HTMLElement;
  expect(pagination).toHaveTextContent(`Showing 1–25 of ${MOCK_COMPANY_ROWS.length} items`);
  expect(pagination).toHaveTextContent("Items per page");
  expect(within(pagination).getByRole("combobox", { name: "Items per page" })).toBeInTheDocument();
  expect(pagination).toHaveTextContent(`Page 1 of ${PAGE_COUNT}`);
  expect(within(pagination).getByRole("button", { name: "Previous page" })).toBeDisabled();
  expect(within(pagination).getByRole("button", { name: "Next page" })).toBeEnabled();
});

test("with no rows the summary and the page position use their functions with zero", () => {
  const container = renderEnglishTable({ data: [] });
  expect(container.querySelector(".gdy-table-pagination-left")).toHaveTextContent("0 items");
  expect(container.querySelector(".gdy-table-pagination-right")).toHaveTextContent("Page 0 of 1");
  expect(screen.getByText("No results found")).toBeInTheDocument();
});

test("a full English labels object translates the value filter menu", () => {
  const panel = openMenu(renderEnglishTable(), "País");
  for (const text of ["Sort", "Ascending (A → Z)", "Descending (Z → A)", "Filter", "Clear", "Values"]) {
    expect(within(panel).getByText(text)).toBeInTheDocument();
  }
  expect(within(panel).getByRole("button", { name: /^Select all \(\d+\)$/ })).toBeInTheDocument();
  fireEvent.change(within(panel).getByPlaceholderText("Search..."), { target: { value: "zzz" } });
  expect(within(panel).getByText("No results")).toBeInTheDocument();
  expect(within(panel).getByRole("button", { name: "Select all" })).toBeInTheDocument();
});

test("a full English labels object translates the date filter menu", () => {
  const panel = openMenu(renderEnglishTable(), "Alta");
  const texts = ["Ascending (oldest → newest)", "Descending (newest → oldest)", "Operator", "After (later date)"];
  for (const text of [...texts, "Before (earlier date)", "Between (range)", "Clear", "Apply"]) {
    expect(within(panel).getByText(text)).toBeInTheDocument();
  }
  fireEvent.click(within(panel).getByText("After (later date)"));
  expect(within(panel).getByText("Dates")).toBeInTheDocument();
  expect(within(panel).getByRole("button", { name: "Pick a date" })).toBeInTheDocument();
});

test("calendarLocale puts the calendar in that language", () => {
  const calendar = openRangeCalendar(renderEnglishTable(), { between: "Between (range)", pickRange: "Pick a range" });
  const weekdays = [...calendar.querySelectorAll(".gdy-calendar-weekday")].map((day) => day.textContent);
  expect(weekdays.slice(0, 7)).toEqual(["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]);
});

test("without calendarLocale the calendar stays in Spanish", () => {
  const calendar = openRangeCalendar(renderTable(), { between: "Entre (rango)", pickRange: "Seleccionar rango" });
  const weekdays = [...calendar.querySelectorAll(".gdy-calendar-weekday")].map((day) => day.textContent);
  expect(weekdays.slice(0, 7)).toEqual(["lu", "ma", "mi", "ju", "vi", "sá", "do"]);
});

test("a react-day-picker locale also translates the calendar's accessible names", () => {
  const calendar = openRangeCalendar(renderTable({ calendarLocale: dayPickerSpanish }), {
    between: "Entre (rango)",
    pickRange: "Seleccionar rango",
  });
  expect(within(calendar).getByRole("button", { name: "Ir al mes anterior" })).toBeInTheDocument();
});

test("a full English labels object translates the row actions and the inline select", () => {
  renderEnglishTable();
  expect(screen.getAllByText("Select...")[0]).toBeInTheDocument();
  fireEvent.keyDown(screen.getAllByRole("button", { name: "Options" })[0], { key: "Enter" });
  for (const action of ["Edit", "View history", "Delete"]) {
    expect(screen.getByRole("menuitem", { name: action })).toBeInTheDocument();
  }
});

test("a partial labels object keeps the Spanish default of every other text", () => {
  const container = renderTable({ labels: { pageOf: (page, count) => `${page}/${count}` } });
  expect(container.querySelector(".gdy-table-pagination-right")).toHaveTextContent(`1/${PAGE_COUNT}`);
  expect(container.querySelector(".gdy-table-pagination-left")).toHaveTextContent("Elementos por página");
  expect(screen.getByRole("button", { name: "Página siguiente" })).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Buscar...")).toBeInTheDocument();
});

test("the older single-text props win over their labels key", () => {
  const container = renderEnglishTable({
    searchPlaceholder: "Find a company",
    createLabel: "New company",
    emptyMessage: "Nothing here",
    label: "companies",
    groupSelectorLabel: "Group",
    groupNoneLabel: "Flat",
    data: [],
  });
  expect(screen.getByPlaceholderText("Find a company")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "New company" })).toBeInTheDocument();
  expect(screen.getByText("Nothing here")).toBeInTheDocument();
  expect(container.querySelector(".gdy-table-pagination-left")).toHaveTextContent("0 companies");
  expect(screen.getByRole("combobox", { name: "Group" })).toHaveTextContent("Group: Flat");
});

test("the row action labels and the archived view labels win over their labels keys", () => {
  renderEnglishTable({
    rowActions: { ...TABLE_ROW_ACTIONS, editLabel: "Modify", triggerLabel: "More" },
    archivedView: { defaultValue: "all", label: "View", optionLabels: { all: "Everything" } },
  });
  expect(screen.getByRole("combobox", { name: "View" })).toHaveTextContent("View: Everything");
  fireEvent.keyDown(screen.getAllByRole("button", { name: "More" })[0], { key: "Enter" });
  expect(screen.getByRole("menuitem", { name: "Modify" })).toBeInTheDocument();
});

test("labeledValue joins the selector prefixes and their options", () => {
  renderTable({ labels: { labeledValue: (label, value) => `${label} · ${value}` } });
  expect(screen.getByRole("combobox", { name: "Agrupar por" })).toHaveTextContent("Agrupar por · Ninguno");
  expect(screen.getByRole("combobox", { name: "Mostrar" })).toHaveTextContent("Mostrar · Todos");
});
