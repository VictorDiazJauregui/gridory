import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { DataTable, type ColumnDefinition, type DataTableProps } from "../components/table";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

const HELP = "Suma de los contratos vigentes";

const withColumn = (id: string, extra: Partial<ColumnDefinition<BaselineRow>>) =>
  BASELINE_COLUMNS.map((column) => (column.id === id ? { ...column, ...extra } : column));

const renderTable = (columns: ColumnDefinition<BaselineRow>[], props: Partial<DataTableProps<BaselineRow>> = {}) =>
  render(<DataTable columns={columns} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />).container;

const headerInner = (container: HTMLElement, id: string) =>
  container.querySelector(`th[data-column-id="${id}"] .gdy-table-head-inner`) as HTMLElement;

test("without the new fields the header markup is the same as before", () => {
  const before = renderTable(BASELINE_COLUMNS).querySelector("thead")?.outerHTML;
  const after = renderTable(withColumn("country", {})).querySelector("thead")?.outerHTML;
  expect(after).toBe(before);
  expect(before).not.toContain("aria-describedby");
  expect(before).not.toContain("data-help-placement");
});

test("headerTooltip adds a help button named after the column, outside the header trigger", () => {
  const container = renderTable(withColumn("country", { headerTooltip: HELP }));
  const help = screen.getByRole("button", { name: "Ayuda sobre País" });
  expect(help).toHaveClass("gdy-table-head-help");
  expect(container.querySelector(".gdy-table-head-trigger .gdy-table-head-help")).toBeNull();
  const trigger = screen.getByRole("button", { name: "País" });
  expect(trigger).toHaveAccessibleDescription(HELP);
});

test("the tooltip opens with the keyboard focus and closes with Escape", async () => {
  renderTable(withColumn("country", { headerTooltip: HELP }));
  const help = screen.getByRole("button", { name: "Ayuda sobre País" });
  act(() => help.focus());
  expect(help).toHaveFocus();
  expect(await screen.findByRole("tooltip")).toHaveTextContent(HELP);
  await userEvent.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
});

test("a click (or tap) toggles the tooltip and never sorts or opens the filter", async () => {
  const onSortChange = vi.fn();
  const container = renderTable(withColumn("name", { headerTooltip: HELP }), { onSortChange });
  const help = screen.getByRole("button", { name: "Ayuda sobre Empresa" });
  fireEvent.click(help);
  expect(await screen.findByRole("tooltip")).toHaveTextContent(HELP);
  fireEvent.click(help);
  await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
  expect(onSortChange).not.toHaveBeenCalled();
  expect(container.querySelector(".gdy-table-menu-holder")).toBeNull();
});

test('placement: "after" by default, "before" with a right-aligned header, and "edge" opposite the title', () => {
  const columns = BASELINE_COLUMNS.map((column) => ({ ...column, headerTooltip: HELP }));
  columns[1] = { ...columns[1], align: "right" };
  columns[2] = { ...columns[2], headerTooltipPlacement: "edge", align: "right" };
  const container = renderTable(columns);
  const childClasses = (id: string) => [...headerInner(container, id).children].slice(0, 2).map((child) => child.className);
  expect(headerInner(container, "name")).toHaveAttribute("data-help-placement", "after");
  expect(childClasses("name")).toEqual(["gdy-table-head-trigger", "gdy-table-head-help"]);
  expect(headerInner(container, "country")).toHaveAttribute("data-help-placement", "before");
  expect(childClasses("country")).toEqual(["gdy-table-head-help", "gdy-table-head-trigger"]);
  expect(headerInner(container, "status")).toHaveAttribute("data-help-placement", "edge");
  expect(childClasses("status")).toEqual(["gdy-table-head-help", "gdy-table-head-trigger"]);
});

test("headerContent replaces the visible title; header stays the accessible name and the menus' text", () => {
  renderTable(withColumn("country", { headerContent: <span data-testid="custom">🌎 País</span> }), {
    groupableColumnIds: ["country"],
  });
  expect(screen.getByTestId("custom")).toBeInTheDocument();
  const trigger = screen.getByRole("button", { name: "País" });
  expect(trigger).toContainElement(screen.getByTestId("custom"));
  fireEvent.click(screen.getByRole("combobox", { name: "Agrupar por" }));
  expect(screen.getByRole("option", { name: "Agrupar por: País" })).toBeInTheDocument();
});

test("labels.columnHelp names the help button", () => {
  renderTable(withColumn("country", { headerTooltip: HELP }), { labels: { columnHelp: (header) => `About ${header}` } });
  expect(screen.getByRole("button", { name: "About País" })).toBeInTheDocument();
});

const tapLikeAPhone = (element: HTMLElement) => {
  fireEvent.pointerDown(element, { pointerType: "touch" });
  fireEvent.pointerUp(element, { pointerType: "touch" });
  act(() => element.focus());
  fireEvent.click(element);
};

test("a tap on a phone opens the tooltip although the focus that follows the finger opens it first", async () => {
  renderTable(withColumn("country", { headerTooltip: HELP }));
  const help = screen.getByRole("button", { name: "Ayuda sobre País" });
  tapLikeAPhone(help);
  expect(await screen.findByRole("tooltip")).toHaveTextContent(HELP);
  fireEvent.pointerDown(help, { pointerType: "touch" });
  fireEvent.click(help);
  await waitFor(() => expect(screen.queryByRole("tooltip")).toBeNull());
});
