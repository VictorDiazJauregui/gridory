import type { KanbanBoardView } from "../board-view";
import { buildCardMover } from "./card-move";
import { useBoardControls } from "./use-board-controls";
import { useCardMoving } from "./use-card-moving";
import { useCollapsedColumns } from "./use-collapsed-columns";
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
  // Only the header extra and the footer read every card of a column, so they are grouped only then.
  const groupAllCards = view.renderColumnHeaderExtra !== undefined || view.renderColumnFooter !== undefined;
  const columns = useGroupColumns({ selectedGroup, cards, visibleCards, emptyValueLabel: view.labels.emptyValue, groupAllCards });
  useVisibleCardsChange({ visibleCards, ...columns }, view);
  const pending = usePendingCards();
  const mover = buildCardMover({ cards, setCards, selectedGroup, view, pending, inputCardsRef });
  const moving = useCardMoving({ view, cards, group: selectedGroup, columns, moveCard: mover.moveCard });
  const collapse = useCollapsedColumns(view);
  return { ...controls, ...columns, ...mover, ...moving, filterOptions, selectedGroup, changeGroup, visibleCards, collapse };
};

export type KanbanBoardState<TData> = ReturnType<
  typeof useKanbanBoardState<TData>
>;

export interface KanbanSectionProps<TData> {
  state: KanbanBoardState<TData>;
  view: KanbanBoardView<TData>;
}
