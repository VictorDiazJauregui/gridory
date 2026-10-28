import { StrictMode } from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import {
  KanbanBoard,
  type KanbanBoardProps,
  type KanbanGroupOption,
  type KanbanVisibleCardsState,
} from "../components/kanban";
import { BASELINE_COLUMNS, BASELINE_ROWS, type BaselineRow } from "./baseline-fixture";

type BoardProps = Partial<KanbanBoardProps<BaselineRow>>;
type VisibleCardsHandler = (state: KanbanVisibleCardsState<BaselineRow>) => void;

const STATUS_GROUP: KanbanGroupOption<BaselineRow> = {
  id: "status",
  label: "Estado",
  accessor: (row) => row.status,
  setValue: (row, status) => ({ ...row, status: status as BaselineRow["status"] }),
};

const boardElement = (onVisibleCardsChange: VisibleCardsHandler, props: BoardProps = {}) => (
  <KanbanBoard
    fields={BASELINE_COLUMNS}
    groups={[STATUS_GROUP]}
    defaultGroupId="status"
    getCardId={(card) => card.id}
    data={BASELINE_ROWS}
    onVisibleCardsChange={onVisibleCardsChange}
    {...props}
  />
);

const renderBoard = (props: BoardProps = {}) => {
  const listener = vi.fn<VisibleCardsHandler>();
  const view = render(boardElement(listener, props));
  return { listener, ...view };
};

const names = (cards: BaselineRow[]) => cards.map((card) => card.name);

const lastState = (listener: ReturnType<typeof vi.fn<VisibleCardsHandler>>) =>
  listener.mock.lastCall?.[0] as KanbanVisibleCardsState<BaselineRow>;

const namesByColumn = (state: KanbanVisibleCardsState<BaselineRow>) =>
  Object.fromEntries(Object.entries(state.byColumn).map(([value, cards]) => [value, names(cards)]));

test("reports every card on mount, grouped by column", () => {
  const { listener } = renderBoard();
  expect(listener).toHaveBeenCalledTimes(1);
  expect(lastState(listener).cards).toEqual(BASELINE_ROWS);
  expect(namesByColumn(lastState(listener))).toEqual({ Activa: ["Frío Delta", "Cold South"], Archivada: ["Pack Norte"] });
});

test("follows the search and keeps the emptied columns with []", () => {
  const { listener } = renderBoard();
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "pack" } });
  expect(names(lastState(listener).cards)).toEqual(["Pack Norte"]);
  expect(namesByColumn(lastState(listener))).toEqual({ Activa: [], Archivada: ["Pack Norte"] });
});

test("follows a field filter", () => {
  const { listener, container } = renderBoard();
  fireEvent.click(screen.getByRole("button", { name: "País" }));
  const panel = container.querySelector(".gdy-panel") as HTMLElement;
  fireEvent.click(within(panel).getByText("México"));
  expect(names(lastState(listener).cards)).toEqual(["Cold South"]);
});

test("follows a card moved to another column", () => {
  const { listener } = renderBoard();
  const card = screen.getByText("Frío Delta").closest(".gdy-kanban-card") as HTMLElement;
  const target = document.querySelector('[data-column-value="Archivada"]') as HTMLElement;
  fireEvent.dragStart(card, { dataTransfer: { setData: vi.fn() } });
  fireEvent.drop(target);
  expect(namesByColumn(lastState(listener))).toEqual({ Activa: ["Cold South"], Archivada: ["Frío Delta", "Pack Norte"] });
});

test("does not report again when a re-render leaves the same cards", () => {
  const listener = vi.fn<VisibleCardsHandler>();
  const { rerender } = render(<StrictMode>{boardElement(listener, { data: { results: BASELINE_ROWS } })}</StrictMode>);
  rerender(<StrictMode>{boardElement(listener, { data: { results: BASELINE_ROWS } })}</StrictMode>);
  expect(listener).toHaveBeenCalledTimes(1);
});

test("stays quiet while loading and reports once when it ends with other cards", () => {
  const listener = vi.fn<VisibleCardsHandler>();
  const { rerender } = render(boardElement(listener, { loading: true }));
  expect(listener).not.toHaveBeenCalled();
  rerender(boardElement(listener, { loading: true, data: BASELINE_ROWS.slice(0, 1) }));
  expect(listener).not.toHaveBeenCalled();
  rerender(boardElement(listener, { data: BASELINE_ROWS.slice(0, 1) }));
  expect(listener).toHaveBeenCalledTimes(1);
  expect(names(lastState(listener).cards)).toEqual(["Frío Delta"]);
});

test("ending a load with the same cards reports nothing new", () => {
  const { listener, rerender } = renderBoard();
  rerender(boardElement(listener, { loading: true }));
  rerender(boardElement(listener, {}));
  expect(listener).toHaveBeenCalledTimes(1);
});
