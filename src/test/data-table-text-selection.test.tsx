import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { DataTable, type DataTableProps } from "../components/table";
import { navigateTo, openInNewTab } from "../components/table/body/browser-navigation";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { clearTextSelection, collapseSelectionIn, selectTextOf, selectWhitespaceIn } from "./text-selection";

vi.mock("../components/table/body/browser-navigation", () => ({ openInNewTab: vi.fn(), navigateTo: vi.fn() }));
beforeEach(() => vi.clearAllMocks());
afterEach(clearTextSelection);

const hrefOf = (row: BaselineRow) => `/empresas/${row.id}`;

const renderTable = (props: Partial<DataTableProps<BaselineRow>> = {}) =>
  render(<DataTable columns={BASELINE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />).container;

const rowAt = (container: HTMLElement, index: number) =>
  container.querySelectorAll(".gdy-table-row")[index] as HTMLElement;
const nameCell = (container: HTMLElement, index = 0) =>
  rowAt(container, index).querySelector('[data-column-id="name"]') as HTMLElement;

const clickWithOption = (select: (container: HTMLElement) => void) => {
  const onRowClick = vi.fn();
  const container = renderTable({ onRowClick, ignoreTextSelectionClick: true });
  select(container);
  fireEvent.click(nameCell(container));
  return onRowClick;
};

test("with the option, a click that ends selecting text inside the row does not fire it", () => {
  expect(clickWithOption((container) => selectTextOf(nameCell(container)))).not.toHaveBeenCalled();
});

test.each([
  ["no selection", () => undefined],
  ["a collapsed selection in the row", (container: HTMLElement) => collapseSelectionIn(nameCell(container))],
  ["a whitespace-only selection in the row", (container: HTMLElement) => selectWhitespaceIn(nameCell(container))],
  ["a selection in another row", (container: HTMLElement) => selectTextOf(nameCell(container, 1))],
  ["a selection outside the table", () => selectTextOf(document.body.appendChild(document.createElement("p")))],
])("with the option, a click with %s still fires the row", (_case, select) => {
  expect(clickWithOption(select)).toHaveBeenCalledTimes(1);
});

test("with the option and getRowHref alone, a selection keeps the row from navigating", () => {
  const container = renderTable({ getRowHref: hrefOf, ignoreTextSelectionClick: true });
  selectTextOf(nameCell(container));
  fireEvent.click(nameCell(container));
  expect(navigateTo).not.toHaveBeenCalled();
  clearTextSelection();
  fireEvent.click(nameCell(container));
  expect(navigateTo).toHaveBeenCalledWith("/empresas/b1");
});

test("without the option, a selection inside the row fires it as in 2.1.0", () => {
  const onRowClick = vi.fn();
  const container = renderTable({ onRowClick });
  selectTextOf(nameCell(container));
  fireEvent.click(nameCell(container));
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

test("with the option, Ctrl/Cmd + click, the middle button and Enter keep working over a selection", () => {
  const onRowClick = vi.fn();
  const container = renderTable({ onRowClick, getRowHref: hrefOf, ignoreTextSelectionClick: true });
  selectTextOf(nameCell(container));
  fireEvent.click(nameCell(container), { ctrlKey: true });
  fireEvent.click(nameCell(container), { metaKey: true });
  fireEvent(nameCell(container), new MouseEvent("auxclick", { bubbles: true, button: 1 }));
  fireEvent.keyDown(rowAt(container, 0), { key: "Enter" });
  expect(openInNewTab).toHaveBeenCalledTimes(3);
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

test("with the option and no link, Ctrl + click over a selection does not fire onRowClick", () => {
  const onRowClick = vi.fn();
  const container = renderTable({ onRowClick, ignoreTextSelectionClick: true });
  selectTextOf(nameCell(container));
  fireEvent.click(nameCell(container), { ctrlKey: true });
  expect(onRowClick).not.toHaveBeenCalled();
});

test("with the option, the second click of a double click, which arrives with the word selected, is ignored", () => {
  const onRowClick = vi.fn();
  const container = renderTable({ onRowClick, ignoreTextSelectionClick: true });
  fireEvent.click(nameCell(container), { detail: 1 });
  selectTextOf(nameCell(container));
  fireEvent.click(nameCell(container), { detail: 2 });
  expect(onRowClick).toHaveBeenCalledTimes(1);
});
