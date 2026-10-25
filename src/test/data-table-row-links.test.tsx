import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import { DataTable, type ColumnDefinition, type DataTableProps } from "../components/table";
import { navigateTo, openInNewTab } from "../components/table/body/browser-navigation";
import { BASELINE_COLUMNS, BASELINE_ROWS, BASELINE_ROW_ACTIONS, type BaselineRow } from "./baseline-fixture";

const LINK_COLUMN: ColumnDefinition<BaselineRow> = {
  id: "link",
  header: "Sitio",
  accessor: (row) => row.id,
  cell: (row) => <a href={`https://example.com/${row.id}`}>sitio</a>,
};

const BUTTON_COLUMN: ColumnDefinition<BaselineRow> = {
  id: "star",
  header: "Favorita",
  accessor: (row) => row.id,
  cell: () => <button type="button">★</button>,
};

const hrefOf = (row: BaselineRow) => `/empresas/${row.id}`;

const renderTable = (props: Partial<DataTableProps<BaselineRow>> = {}) =>
  render(
    <DataTable
      columns={[...BASELINE_COLUMNS, LINK_COLUMN, BUTTON_COLUMN]}
      data={BASELINE_ROWS}
      getRowId={(row) => row.id}
      rowActions={BASELINE_ROW_ACTIONS}
      {...props}
    />,
  ).container;

const firstRow = (container: HTMLElement) => container.querySelector(".gdy-table-row") as HTMLElement;
const cellOf = (container: HTMLElement, columnId: string) =>
  firstRow(container).querySelector(`[data-column-id="${columnId}"]`) as HTMLElement;

vi.mock("../components/table/body/browser-navigation", () => ({ openInNewTab: vi.fn(), navigateTo: vi.fn() }));
const openWindow = vi.mocked(openInNewTab);
beforeEach(() => vi.clearAllMocks());

test("onRowClick receives the row and the click event; a one-argument handler still works", () => {
  const onRowClick = vi.fn((row: BaselineRow) => row.id);
  const container = renderTable({ onRowClick });
  fireEvent.click(cellOf(container, "name"));
  expect(onRowClick).toHaveBeenCalledWith(BASELINE_ROWS[0], expect.objectContaining({ type: "click" }));
});

test("without onRowClick nor getRowHref the row has no handlers, tabindex or data-href", () => {
  const row = firstRow(renderTable());
  expect(row).not.toHaveAttribute("tabindex");
  expect(row).not.toHaveAttribute("data-href");
  expect(row).not.toHaveAttribute("data-clickable");
});

test("with onRowClick alone the row is not focusable, as in 1.0.1", () => {
  const onRowClick = vi.fn();
  const row = firstRow(renderTable({ onRowClick }));
  expect(row).not.toHaveAttribute("tabindex");
  fireEvent.keyDown(row, { key: "Enter" });
  expect(onRowClick).not.toHaveBeenCalled();
});

test("focusableRows makes the onRowClick rows focusable and Enter fires them", () => {
  const onRowClick = vi.fn();
  const row = firstRow(renderTable({ onRowClick, focusableRows: true }));
  expect(row).toHaveAttribute("tabindex", "0");
  fireEvent.keyDown(row, { key: "Enter" });
  expect(onRowClick).toHaveBeenCalledWith(BASELINE_ROWS[0], expect.objectContaining({ type: "keydown" }));
});

test("getRowHref marks the row and makes it focusable unless focusableRows is false", () => {
  const container = renderTable({ getRowHref: hrefOf });
  expect(firstRow(container)).toHaveAttribute("data-href", "/empresas/b1");
  expect(firstRow(container)).toHaveAttribute("data-clickable");
  expect(firstRow(container)).toHaveAttribute("tabindex", "0");
  const off = renderTable({ getRowHref: hrefOf, focusableRows: false });
  expect(firstRow(off)).not.toHaveAttribute("tabindex");
});

test.each([{ ctrlKey: true }, { metaKey: true }])("Ctrl or Cmd + click opens the link in a new tab instead of onRowClick (%o)", (modifier) => {
  const onRowClick = vi.fn();
  const container = renderTable({ onRowClick, getRowHref: hrefOf });
  fireEvent.click(cellOf(container, "name"), modifier);
  expect(openWindow).toHaveBeenCalledWith("/empresas/b1");
  expect(onRowClick).not.toHaveBeenCalled();
});

test("the middle button opens the link; the right button does not", () => {
  const container = renderTable({ getRowHref: hrefOf });
  fireEvent(cellOf(container, "name"), new MouseEvent("auxclick", { bubbles: true, button: 2 }));
  expect(openWindow).not.toHaveBeenCalled();
  fireEvent(cellOf(container, "name"), new MouseEvent("auxclick", { bubbles: true, button: 1 }));
  expect(openWindow).toHaveBeenCalledWith("/empresas/b1");
});

test("a plain click calls onRowClick when both are set, so the app can route", () => {
  const onRowClick = vi.fn();
  const container = renderTable({ onRowClick, getRowHref: hrefOf });
  fireEvent.click(cellOf(container, "name"));
  expect(onRowClick).toHaveBeenCalledTimes(1);
  expect(openWindow).not.toHaveBeenCalled();
});

test("without onRowClick, a plain click and Enter navigate to the link in the same tab", () => {
  const container = renderTable({ getRowHref: hrefOf });
  fireEvent.click(cellOf(container, "name"));
  fireEvent.keyDown(firstRow(container), { key: "Enter" });
  expect(vi.mocked(navigateTo).mock.calls).toEqual([["/empresas/b1"], ["/empresas/b1"]]);
  expect(openWindow).not.toHaveBeenCalled();
});

test("Ctrl + Enter on a link row opens it in a new tab", () => {
  const container = renderTable({ getRowHref: hrefOf, onRowClick: vi.fn() });
  fireEvent.keyDown(firstRow(container), { key: "Enter", ctrlKey: true });
  expect(openWindow).toHaveBeenCalledWith("/empresas/b1");
});

test("Enter on the ⋯ button or on a control of a cell never fires the row", () => {
  const onRowClick = vi.fn();
  const container = renderTable({ onRowClick, getRowHref: hrefOf, focusableRows: true });
  fireEvent.keyDown(screen.getAllByRole("button", { name: "Opciones" })[0], { key: "Enter" });
  fireEvent.keyDown(cellOf(container, "star").querySelector("button") as HTMLElement, { key: "Enter" });
  expect(onRowClick).not.toHaveBeenCalled();
  expect(openWindow).not.toHaveBeenCalled();
});

test("Ctrl + click and the middle button on a link inside a cell leave it to the browser", () => {
  const container = renderTable({ getRowHref: hrefOf });
  const link = cellOf(container, "link").querySelector("a") as HTMLElement;
  fireEvent.click(link, { ctrlKey: true });
  fireEvent(link, new MouseEvent("auxclick", { bubbles: true, button: 1 }));
  expect(openWindow).not.toHaveBeenCalled();
});

test("a plain click on a consumer's button still reaches onRowClick, as in 1.0.1", () => {
  const onRowClick = vi.fn();
  const container = renderTable({ onRowClick });
  fireEvent.click(cellOf(container, "star").querySelector("button") as HTMLElement);
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

test("no gesture that starts in an ignoreRowClick column fires the row", () => {
  const onRowClick = vi.fn();
  const columns = [...BASELINE_COLUMNS, { ...BUTTON_COLUMN, ignoreRowClick: true }];
  const { container } = render(
    <DataTable columns={columns} data={BASELINE_ROWS} getRowId={(row) => row.id} onRowClick={onRowClick} getRowHref={hrefOf} />,
  );
  const cell = cellOf(container, "star");
  fireEvent.click(cell);
  fireEvent.click(cell.querySelector("button") as HTMLElement, { ctrlKey: true });
  fireEvent(cell, new MouseEvent("auxclick", { bubbles: true, button: 1 }));
  expect(onRowClick).not.toHaveBeenCalled();
  expect(openWindow).not.toHaveBeenCalled();
  fireEvent.click(cellOf(container, "name"));
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

test.each(["javascript:alert(1)", " JavaScript:alert(1)", "java\nscript:alert(1)", "data:text/html,x", "vbscript:x"])(
  "an unsafe destination (%j) is ignored",
  (unsafe) => {
    const container = renderTable({ getRowHref: () => unsafe });
    expect(firstRow(container)).not.toHaveAttribute("data-href");
    fireEvent.click(cellOf(container, "name"), { ctrlKey: true });
    expect(openWindow).not.toHaveBeenCalled();
  },
);

test("a data-href from getRowAttributes never replaces the table's own", () => {
  const container = renderTable({ getRowHref: hrefOf, getRowAttributes: () => ({ "data-href": "/otra" }) });
  expect(firstRow(container)).toHaveAttribute("data-href", "/empresas/b1");
  const withoutHref = renderTable({ getRowAttributes: () => ({ "data-href": "/otra" }) });
  expect(firstRow(withoutHref)).not.toHaveAttribute("data-href");
});

test("Ctrl + click without getRowHref keeps calling onRowClick, as in 1.0.1", () => {
  const onRowClick = vi.fn();
  const container = renderTable({ onRowClick });
  fireEvent.click(cellOf(container, "name"), { ctrlKey: true });
  expect(onRowClick).toHaveBeenCalledTimes(1);
  expect(openWindow).not.toHaveBeenCalled();
});
