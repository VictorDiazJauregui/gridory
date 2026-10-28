import type { KanbanBoardView } from "../board-view";
import { buildCardMover } from "./card-move";
import { useBoardControls } from "./use-board-controls";
import { buildDropPermission } from "./drop-permission";
import { useCardDrag } from "./use-card-drag";
import { useGroupColumns } from "./use-group-columns";
import { useKanbanCards } from "./use-kanban-cards";
import { useSelectedGroup } from "./use-selected-group";
import { usePendingCards } from "./use-pending-cards";
import { useVisibleCards } from "./use-visible-cards";
import { useVisibleCardsChange } from "./use-visible-cards-change";

export const useKanbanBoardState = <TData>(view: KanbanBoardView<TData>) => {
  const controls = useBoardControls(view);
  const { cards, setCards, filterOptions, inputCardsRef } = useKanbanCards(view);
  const { selectedGroup, changeGroup } = useSelectedGroup(view);
  const visibleCards = useVisibleCards({ cards, view, ...controls });
  const columns = useGroupColumns({
    selectedGroup,
    cards,
    visibleCards,
    emptyValueLabel: view.labels.emptyValue,
    groupAllCards: view.renderColumnHeaderExtra !== undefined,
  });
  useVisibleCardsChange({ visibleCards, ...columns }, view);
  const pending = usePendingCards();
  const mover = buildCardMover({ cards, setCards, selectedGroup, view, pending, inputCardsRef });
  const isDropAllowed = buildDropPermission({ cards, group: selectedGroup, view });
  const drag = useCardDrag({ enabled: view.flags.dragAndDrop, isDropAllowed, columnValues: columns.visibleColumnValues });
  return { ...controls, ...columns, ...mover, filterOptions, selectedGroup, changeGroup, visibleCards, drag, isDropAllowed };
};

export type KanbanBoardState<TData> = ReturnType<
  typeof useKanbanBoardState<TData>
>;

export interface KanbanSectionProps<TData> {
  state: KanbanBoardState<TData>;
  view: KanbanBoardView<TData>;
}
