import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import {
  KanbanBoard,
  type KanbanBoardProps,
  type KanbanColumnHeaderContext,
  type KanbanGroupOption,
} from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROW_ACTIONS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type BoardProps = Partial<KanbanBoardProps<BaselineRow>>;
type HeaderContext = KanbanColumnHeaderContext<BaselineRow>;

const FEES: Record<string, number> = { b1: 100, b2: 40, b3: 25 };

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
};

const sumFees = (cards: BaselineRow[]) => cards.reduce((total, card) => total + FEES[card.id], 0);

const renderTotals = ({ cards, allCards }: HeaderContext) => `${sumFees(cards)} / ${sumFees(allCards)}`;

const renderBoard = (props: BoardProps = {}) =>
  render(
    <KanbanBoard
      fields={BASELINE_COLUMNS}
      groups={[STATUS_GROUP]}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      data={BASELINE_ROWS}
      {...props}
    />,
  );

const columnHead = (value: string) =>
  document.querySelector(`[data-column-value="${value}"] .gdy-kanban-column-head`) as HTMLElement;

const extraOf = (value: string) => columnHead(value).querySelector(".gdy-kanban-column-extra");

test("sums the visible cards and every card of the column while a search is active", () => {
  renderBoard({ renderColumnHeaderExtra: renderTotals });
  expect(extraOf("Activa")?.textContent).toBe("125 / 125");
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "frío" } });
  expect(extraOf("Activa")?.textContent).toBe("100 / 125");
});

test("receives the value, the label, the group and both card lists", () => {
  const renderExtra = vi.fn<(context: HeaderContext) => string>(() => "extra");
  renderBoard({ renderColumnHeaderExtra: renderExtra });
  const archived = renderExtra.mock.calls.map(([context]) => context).find((context) => context.value === "Archivada");
  expect(archived).toEqual({
    value: "Archivada",
    label: "Archivada",
    groupId: "status",
    cards: [BASELINE_ROWS[1]],
    allCards: [BASELINE_ROWS[1]],
  });
});

test("renders the content between the title and the count", () => {
  renderBoard({ renderColumnHeaderExtra: () => "extra" });
  const parts = Array.from(columnHead("Activa").children).map((child) => child.className);
  expect(parts).toEqual(["gdy-kanban-column-title", "gdy-kanban-column-extra", "gdy-kanban-column-count"]);
});

test("renders no container when the function returns null, undefined or a boolean", () => {
  const empties: Record<string, null | undefined | boolean> = { Activa: null, Archivada: false };
  renderBoard({ renderColumnHeaderExtra: ({ value }) => empties[value] });
  expect(document.querySelectorAll(".gdy-kanban-column-extra")).toHaveLength(0);
});

test("keeps the header as it was without the prop", () => {
  renderBoard();
  expect(document.querySelectorAll(".gdy-kanban-column-extra")).toHaveLength(0);
  expect(columnHead("Activa").children).toHaveLength(2);
});

test("allCards keeps the cards the archived view hides", () => {
  renderBoard({ renderColumnHeaderExtra: renderTotals, rowActions: BASELINE_ROW_ACTIONS, archivedView: {} });
  expect(screen.queryByText("Pack Norte")).toBeNull();
  expect(extraOf("Archivada")?.textContent).toBe("0 / 40");
});

test("is not called while loading, not even for the loading columns", () => {
  const renderExtra = vi.fn(() => "extra");
  const { rerender } = renderBoard({ renderColumnHeaderExtra: renderExtra, loading: true });
  expect(renderExtra).not.toHaveBeenCalled();
  expect(document.querySelectorAll(".gdy-kanban-column-extra")).toHaveLength(0);
  rerender(
    <KanbanBoard
      fields={BASELINE_COLUMNS}
      groups={[STATUS_GROUP]}
      defaultGroupId="status"
      getCardId={(card) => card.id}
      data={BASELINE_ROWS}
      renderColumnHeaderExtra={renderExtra}
    />,
  );
  expect(document.querySelectorAll(".gdy-kanban-column-extra")).toHaveLength(2);
});
