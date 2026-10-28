import type { KanbanBoardView } from "../board-view";
import type { FilterOption, KanbanGroupOption } from "../types";
import type { MoveCard } from "./card-move";
import { buildDropPermission, buildDropRejectionReason } from "./drop-permission";
import { useCardDrag } from "./use-card-drag";
import { useMoveMenu } from "./use-move-menu";

interface CardMovingInput<TData> {
  view: KanbanBoardView<TData>;
  cards: TData[];
  group: KanbanGroupOption<TData>;
  columns: { groupColumns: FilterOption[]; visibleColumnValues: string[] };
  moveCard: MoveCard<TData>;
}

/** The two ways of moving a card, dragging and the "Move to" menu, sharing one `canDrop` rule. */
export const useCardMoving = <TData>({ view, cards, group, columns, moveCard }: CardMovingInput<TData>) => {
  const dropInput = { cards, group, view };
  const isDropAllowed = buildDropPermission(dropInput);
  const drag = useCardDrag({ enabled: view.flags.dragAndDrop, isDropAllowed, columnValues: columns.visibleColumnValues });
  const getRejectionReason = buildDropRejectionReason(dropInput);
  const moveMenu = useMoveMenu({ view, ...columns, moveCard, isDropAllowed, getRejectionReason });
  return { isDropAllowed, drag, moveMenu };
};
