import type { KanbanBoardProps, KanbanMoveEvent, KanbanVisibleCardsState } from "../../kanban";
import type { MockCompanyRow } from "../company/company-rows";
import { replaceRow, type MockRowsUpdater } from "../company/row-updates";
import type { RecordDemoEvent } from "../shared/use-demo-event-log";
import { buildStatusSubmenu } from "../company/status-submenu";
import { buildFavoriteAction } from "./favorite-action";
import { KANBAN_STATIC_PROPS } from "./kanban-config";
import { saveMoveOnServer } from "./simulated-move-server";
import type { useFavoriteCards } from "./use-favorite-cards";

type KanbanHookProps = Pick<
  KanbanBoardProps<MockCompanyRow>,
  "getColumnClassName" | "onCardMove" | "onCardMoveError" | "onVisibleCardsChange" | "rowActions"
>;

interface KanbanHookInput {
  setCards: MockRowsUpdater;
  record: RecordDemoEvent;
  favorites: ReturnType<typeof useFavoriteCards>;
}

// The background goes through the column token, so no rule of the board changes.
const paintActiveColumn = (value: string) =>
  value === "Activa"
    ? "[--gdy-kanban-column-bg:theme(colors.emerald.50)] dark:[--gdy-kanban-column-bg:theme(colors.emerald.950)]"
    : undefined;

const summarizeMove = ({ cardId, fromValue, toValue }: KanbanMoveEvent<MockCompanyRow>) => ({ cardId, fromValue, toValue });

// The demo stores the move only once the server accepts it; the board shows it meanwhile.
const buildServerMove =
  ({ setCards, record }: KanbanHookInput) =>
  async (event: KanbanMoveEvent<MockCompanyRow>) => {
    record("onCardMove", summarizeMove(event));
    await saveMoveOnServer(event);
    replaceRow(setCards, event.updatedCard);
  };

const buildMoveErrorReport = (record: RecordDemoEvent) => (error: unknown, event: KanbanMoveEvent<MockCompanyRow>) =>
  record("onCardMoveError", { cardId: event.cardId, error: error instanceof Error ? error.message : String(error) });

const buildRowActions = ({ setCards, favorites }: KanbanHookInput) => {
  const staticActions = KANBAN_STATIC_PROPS.rowActions;
  const changeStatus = buildStatusSubmenu((row, status) => replaceRow(setCards, { ...row, status }));
  const favorite = buildFavoriteAction(favorites.favoriteIds, favorites.toggleFavorite);
  return { ...staticActions, customActions: [favorite, ...(staticActions.customActions ?? []), changeStatus] };
};

// Counts are enough to follow the event: the full cards would flood the log.
const countVisibleCards = ({ cards, byColumn }: KanbanVisibleCardsState<MockCompanyRow>) => ({
  cards: cards.length,
  byColumn: Object.fromEntries(Object.entries(byColumn).map(([value, columnCards]) => [value, columnCards.length])),
});

// The props added in 1.3.0, kept apart so `?baseline=1` can render the 1.2.0 board.
export const buildKanbanHookProps = (input: KanbanHookInput): KanbanHookProps => ({
  getColumnClassName: paintActiveColumn,
  onCardMove: buildServerMove(input),
  onCardMoveError: buildMoveErrorReport(input.record),
  onVisibleCardsChange: (state) => input.record("onVisibleCardsChange", countVisibleCards(state)),
  rowActions: buildRowActions(input),
});
