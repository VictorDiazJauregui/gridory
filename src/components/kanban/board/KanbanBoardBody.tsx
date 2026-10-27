import { cn } from "../../../lib/cn";
import { KanbanColumns } from "./KanbanColumns";
import { KanbanLoadingColumns } from "./KanbanLoadingColumns";
import type { KanbanSectionProps } from "../model/use-kanban-board-state";

const KanbanBoardContent = <TData,>({ state, view }: KanbanSectionProps<TData>) => {
  if (view.loading) {
    return view.renderLoading ? view.renderLoading() : <KanbanLoadingColumns state={state} view={view} />;
  }
  if (state.visibleCards.length === 0) {
    return <div className={cn("gdy-empty", view.classNames?.empty)}>{view.emptyMessage}</div>;
  }
  return <KanbanColumns state={state} view={view} />;
};

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
    <KanbanBoardContent state={state} view={view} />
  </div>
);
