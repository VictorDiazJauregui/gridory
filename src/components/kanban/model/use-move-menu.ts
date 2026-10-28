import { useMediaQuery } from "../../shared/media/use-media-query";
import type { KanbanBoardView } from "../board-view";
import type { FilterOption, KanbanMoveEvent } from "../types";
import type { CardMoveObserver, MoveCard } from "./card-move";
import type { DropPermission, DropRejectionReason } from "./drop-permission";
import { resolveColumnLabel } from "./group-columns";
import { useMoveFeedback, type MoveFeedback } from "./use-move-feedback";

const DEFAULT_MOVE_MENU_MEDIA_QUERY = "(pointer: coarse)";

interface MoveMenuInput<TData> {
  view: KanbanBoardView<TData>;
  groupColumns: FilterOption[];
  visibleColumnValues: string[];
  moveCard: MoveCard<TData>;
  isDropAllowed: DropPermission;
  getRejectionReason: DropRejectionReason;
}

// The query is always watched (hooks cannot be conditional); "always" and "never" just ignore it.
const useMoveMenuEnabled = <TData>({ moveMenu = "auto", moveMenuMediaQuery, flags }: KanbanBoardView<TData>) => {
  const matches = useMediaQuery(moveMenuMediaQuery ?? DEFAULT_MOVE_MENU_MEDIA_QUERY);
  if (!flags.dragAndDrop || moveMenu === "never") return false;
  return moveMenu === "always" || matches;
};

const buildColumnOptions = <TData>({ view, groupColumns, visibleColumnValues }: MoveMenuInput<TData>) =>
  visibleColumnValues.map((value) => ({
    value,
    label: resolveColumnLabel(groupColumns, value, view.labels.emptyValue),
  }));

const buildMoveObserver = <TData>(
  input: MoveMenuInput<TData>,
  feedback: MoveFeedback,
): CardMoveObserver<TData> => {
  const columnLabel = (value: string) => resolveColumnLabel(input.groupColumns, value, input.view.labels.emptyValue);
  return {
    onMoved: ({ cardId, toValue }: KanbanMoveEvent<TData>) => {
      feedback.announce(input.view.labels.cardMovedTo(columnLabel(toValue)));
      feedback.focusCard(cardId);
    },
    onReverted: ({ cardId, fromValue }: KanbanMoveEvent<TData>) => {
      feedback.announce(input.view.labels.cardMoveReverted(columnLabel(fromValue)));
      if (feedback.ownsFocus(cardId)) feedback.focusCard(cardId);
    },
  };
};

/** The "Move to" action of the card menu: when it shows, where a card can go and how it moves. */
export const useMoveMenu = <TData>(input: MoveMenuInput<TData>) => {
  const enabled = useMoveMenuEnabled(input.view);
  const feedback = useMoveFeedback();
  const observer = buildMoveObserver(input, feedback);
  // Asked again on select, like a drop: the menu may have been opened before the data changed.
  const moveFromMenu = (cardId: string, toValue: string) => {
    if (input.isDropAllowed(cardId, toValue)) input.moveCard(cardId, toValue, observer);
  };
  return {
    enabled,
    columns: buildColumnOptions(input),
    isDropAllowed: input.isDropAllowed,
    getRejectionReason: input.getRejectionReason,
    moveFromMenu,
    feedback,
  };
};

export type MoveMenuState = ReturnType<typeof useMoveMenu>;
