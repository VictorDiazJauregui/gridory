import { cn } from "../../../lib/cn";
import { KanbanColumns } from "./KanbanColumns";
import type { KanbanSectionProps } from "../model/use-kanban-board-state";

export const KanbanBoardBody = <TData,>({
  state,
  view,
}: KanbanSectionProps<TData>) => (
  <div
    className={cn(
      "gdy-kanban-board-wrap gdy-scroll",
      view.boardMinHeightClassName,
      view.boardWrapClassName,
      view.classNames?.board,
    )}
  >
    {state.visibleCards.length === 0 ? (
      <div className={cn("gdy-empty", view.classNames?.empty)}>{view.emptyMessage}</div>
    ) : (
      <KanbanColumns state={state} view={view} />
    )}
  </div>
);
