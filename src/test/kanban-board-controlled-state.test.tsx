import { useState } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { KanbanBoard, type ColumnFiltersState, type ColumnSortingState, type KanbanBoardProps } from "../components/kanban";
import type { KanbanGroupOption } from "../components/kanban/types";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type BoardProps = Partial<KanbanBoardProps<BaselineRow>>;

const GROUPS: KanbanGroupOption<BaselineRow>[] = [
  { id: "country", label: "País", accessor: (row) => row.country, setValue: (row, country) => ({ ...row, country }) },
];

const FIELDS = BASELINE_COLUMNS.map((column) => ({ ...column, filterable: true }));
const NO_FILTERS: ColumnFiltersState = { values: {}, dates: {} };
const ACTIVE_ONLY: ColumnFiltersState = { values: { status: ["Activa"] }, dates: {} };

const boardElement = (props: BoardProps = {}) => (
  <KanbanBoard
    fields={FIELDS}
    groups={GROUPS}
    defaultGroupId="country"
    getCardId={(card) => card.id}
    data={BASELINE_ROWS}
    {...props}
  />
);

const cardTitles = (container: HTMLElement) =>
  [...container.querySelectorAll(".gdy-kanban-card-title")].map((title) => title.textContent);

// The cards are split by country, so only the single-column sort tests read the screen order.
const shownTitles = (container: HTMLElement) => cardTitles(container).sort();

const searchBox = () => screen.getByRole("searchbox") as HTMLInputElement;

const openFilter = (container: HTMLElement, header: string) => {
  fireEvent.click(screen.getByRole("button", { name: header }));
  return container.querySelector(".gdy-panel") as HTMLElement;
};

test("without the new props the board searches, filters and sorts on its own and reports nothing", () => {
  const { container } = render(boardElement());
  fireEvent.change(searchBox(), { target: { value: "Cold" } });
  expect(cardTitles(container)).toEqual(["Cold South"]);
  fireEvent.change(searchBox(), { target: { value: "" } });
  fireEvent.click(within(openFilter(container, "Estado")).getByText("Activa"));
  expect(shownTitles(container)).toEqual(["Cold South", "Frío Delta"]);
});

test("reports nothing on mount, controlled or not", () => {
  const onSearchChange = vi.fn();
  const onSortChange = vi.fn();
  const onFiltersChange = vi.fn();
  render(boardElement({ search: "Cold", sorting: null, columnFilters: ACTIVE_ONLY, onSearchChange, onSortChange, onFiltersChange }));
  render(boardElement({ onSearchChange, onSortChange, onFiltersChange }));
  [onSearchChange, onSortChange, onFiltersChange].forEach((callback) => expect(callback).not.toHaveBeenCalled());
});

test("a controlled search fills the box, filters the cards and only reports what the user types", () => {
  const onSearchChange = vi.fn();
  const { container, rerender } = render(boardElement({ search: "Cold", onSearchChange }));
  expect(searchBox().value).toBe("Cold");
  expect(cardTitles(container)).toEqual(["Cold South"]);
  rerender(boardElement({ search: "", onSearchChange }));
  expect(cardTitles(container)).toHaveLength(3);
  fireEvent.change(searchBox(), { target: { value: "Pack" } });
  expect(onSearchChange).toHaveBeenCalledExactlyOnceWith("Pack");
  expect(searchBox().value).toBe("");
});

test("an uncontrolled search still reports every change", () => {
  const onSearchChange = vi.fn();
  const { container } = render(boardElement({ onSearchChange }));
  fireEvent.change(searchBox(), { target: { value: "Pack" } });
  expect(onSearchChange).toHaveBeenCalledExactlyOnceWith("Pack");
  expect(cardTitles(container)).toEqual(["Pack Norte"]);
});

test("filters set from outside apply and a removed filter shows every card again", () => {
  const { container, rerender } = render(boardElement({ columnFilters: ACTIVE_ONLY }));
  expect(shownTitles(container)).toEqual(["Cold South", "Frío Delta"]);
  expect(screen.getByRole("button", { name: "Estado" })).toHaveAttribute("data-filtered");
  rerender(boardElement({ columnFilters: NO_FILTERS }));
  expect(cardTitles(container)).toHaveLength(3);
});

test("a filter picked by the user is reported without changing controlled filters", () => {
  const onFiltersChange = vi.fn();
  const { container } = render(boardElement({ columnFilters: NO_FILTERS, onFiltersChange }));
  fireEvent.click(within(openFilter(container, "Estado")).getByText("Activa"));
  expect(onFiltersChange).toHaveBeenCalledExactlyOnceWith(ACTIVE_ONLY);
  expect(cardTitles(container)).toHaveLength(3);
});

const ControlledBoard = ({ onSortChange }: { onSortChange: (sorting: ColumnSortingState | null) => void }) => {
  const [sorting, setSorting] = useState<ColumnSortingState | null>(null);
  const handleChange = (next: ColumnSortingState | null) => {
    setSorting(next);
    onSortChange(next);
  };
  return boardElement({ sorting, onSortChange: handleChange });
};

test("a sort set from outside orders the cards inside each column", () => {
  const sortByName: ColumnSortingState = { id: "name", direction: "desc" };
  const { container, rerender } = render(boardElement({ groups: [{ ...GROUPS[0], accessor: () => "" }], sorting: sortByName }));
  expect(cardTitles(container)).toEqual(["Pack Norte", "Frío Delta", "Cold South"]);
  rerender(boardElement({ groups: [{ ...GROUPS[0], accessor: () => "" }], sorting: null }));
  expect(cardTitles(container)).toEqual(["Frío Delta", "Pack Norte", "Cold South"]);
});

test("a controlled board reports the sort picked in a filter menu", () => {
  const onSortChange = vi.fn();
  const { container } = render(<ControlledBoard onSortChange={onSortChange} />);
  fireEvent.click(within(openFilter(container, "Empresa")).getByText("Ascendente (A → Z)"));
  expect(onSortChange).toHaveBeenCalledExactlyOnceWith({ id: "name", direction: "asc" });
});
