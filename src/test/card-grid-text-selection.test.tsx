import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { CardGrid, type CardGridProps } from "../components/card-grid";
import { navigateTo, openInNewTab } from "../components/table/body/browser-navigation";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";
import { clearTextSelection, collapseSelectionIn, selectTextOf, selectWhitespaceIn } from "./text-selection";

vi.mock("../components/table/body/browser-navigation", () => ({ openInNewTab: vi.fn(), navigateTo: vi.fn() }));
beforeEach(() => vi.clearAllMocks());
afterEach(clearTextSelection);

const hrefOf = (row: BaselineRow) => `/empresas/${row.id}`;

const renderGrid = (props: Partial<CardGridProps<BaselineRow>> = {}) =>
  render(<CardGrid columns={BASELINE_COLUMNS} data={BASELINE_ROWS} getRowId={(row) => row.id} {...props} />);

const titleOf = (name: string) => screen.getByText(name);
const cardOf = (name: string) => titleOf(name).closest("li") as HTMLElement;

const clickWithOption = (select: () => void) => {
  const onRowClick = vi.fn();
  renderGrid({ onRowClick, ignoreTextSelectionClick: true });
  select();
  fireEvent.click(titleOf("Frío Delta"));
  return onRowClick;
};

test("with the option, a click that ends selecting text inside the card does not fire it", () => {
  expect(clickWithOption(() => selectTextOf(titleOf("Frío Delta")))).not.toHaveBeenCalled();
});

test.each([
  ["no selection", () => undefined],
  ["a collapsed selection in the card", () => collapseSelectionIn(titleOf("Frío Delta"))],
  ["a whitespace-only selection in the card", () => selectWhitespaceIn(titleOf("Frío Delta"))],
  ["a selection in another card", () => selectTextOf(titleOf("Pack Norte"))],
  ["a selection outside the grid", () => selectTextOf(document.body.appendChild(document.createElement("p")))],
])("with the option, a click with %s still fires the card", (_case, select) => {
  expect(clickWithOption(select)).toHaveBeenCalledTimes(1);
});

test("with the option and getRowHref alone, a selection keeps the card from navigating", () => {
  renderGrid({ getRowHref: hrefOf, ignoreTextSelectionClick: true });
  selectTextOf(titleOf("Frío Delta"));
  fireEvent.click(titleOf("Frío Delta"));
  expect(navigateTo).not.toHaveBeenCalled();
  clearTextSelection();
  fireEvent.click(titleOf("Frío Delta"));
  expect(navigateTo).toHaveBeenCalledWith("/empresas/b1");
});

test("without the option, a selection inside the card fires it as in 2.1.0", () => {
  const onRowClick = vi.fn();
  renderGrid({ onRowClick });
  selectTextOf(titleOf("Frío Delta"));
  fireEvent.click(titleOf("Frío Delta"));
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

test("with the option, Ctrl/Cmd + click, the middle button and Enter keep working over a selection", () => {
  const onRowClick = vi.fn();
  renderGrid({ onRowClick, getRowHref: hrefOf, ignoreTextSelectionClick: true });
  selectTextOf(titleOf("Frío Delta"));
  fireEvent.click(titleOf("Frío Delta"), { ctrlKey: true });
  fireEvent.click(titleOf("Frío Delta"), { metaKey: true });
  fireEvent(titleOf("Frío Delta"), new MouseEvent("auxclick", { bubbles: true, button: 1 }));
  fireEvent.keyDown(cardOf("Frío Delta"), { key: "Enter" });
  expect(openInNewTab).toHaveBeenCalledTimes(3);
  expect(onRowClick).toHaveBeenCalledTimes(1);
});

test("with the option, the second click of a double click, which arrives with the word selected, is ignored", () => {
  const onRowClick = vi.fn();
  renderGrid({ onRowClick, ignoreTextSelectionClick: true });
  fireEvent.click(titleOf("Frío Delta"), { detail: 1 });
  selectTextOf(titleOf("Frío Delta"));
  fireEvent.click(titleOf("Frío Delta"), { detail: 2 });
  expect(onRowClick).toHaveBeenCalledTimes(1);
});
