import type { KanbanBoardView } from "../board-view";
import { buildCardMover } from "./card-move";
import { useBoardControls } from "./use-board-controls";
import { useCardDrag } from "./use-card-drag";
import { useGroupColumns } from "./use-group-columns";
import { useKanbanCards } from "./use-kanban-cards";
import { useSelectedGroup } from "./use-selected-group";
import { useVisibleCards } from "./use-visible-cards";

export const useKanbanBoardState = <TData>(view: KanbanBoardView<TData>) => {
  const controls = useBoardControls(view);
  const { cards, setCards, filterOptions } = useKanbanCards(view);
  const { selectedGroup, changeGroup } = useSelectedGroup(view);
  const visibleCards = useVisibleCards({ cards, view, ...controls });
  const columns = useGroupColumns({ selectedGroup, cards, visibleCards });
  const mover = buildCardMover({ cards, setCards, selectedGroup, view });
  const drag = useCardDrag(view.flags.dragAndDrop);
  return {
    ...controls,
    ...columns,
    ...mover,
    filterOptions,
    selectedGroup,
    changeGroup,
    visibleCards,
    drag,
  };
};

export type KanbanBoardState<TData> = ReturnType<
  typeof useKanbanBoardState<TData>
>;

export interface KanbanSectionProps<TData> {
  state: KanbanBoardState<TData>;
  view: KanbanBoardView<TData>;
}
