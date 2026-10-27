import { cn } from "../../../lib/cn";
import { buildPlaceholderKeys, resolveLoadingRowCount } from "../../shared/loading/loading-state";
import { SkeletonBar } from "../../shared/loading/SkeletonBar";
import { resolveColumnLabel } from "../model/group-columns";
import type { KanbanSectionProps } from "../model/use-kanban-board-state";
import type { KanbanBoardClassNames } from "../types";

const PLACEHOLDER_COLUMN_COUNT = 3;

interface LoadingColumnProps {
  label?: string;
  cardCount: number;
  classNames?: KanbanBoardClassNames;
}

const KanbanCardSkeleton = () => (
  <article className="gdy-kanban-card-skeleton" aria-hidden="true">
    <SkeletonBar />
    <SkeletonBar />
    <SkeletonBar />
  </article>
);

const KanbanLoadingColumn = ({ label, cardCount, classNames }: LoadingColumnProps) => (
  <section className={cn("gdy-kanban-column", classNames?.column)}>
    <header className={cn("gdy-kanban-column-head", classNames?.columnHead)}>
      <span className="gdy-kanban-column-title" title={label}>
        {label ?? <SkeletonBar />}
      </span>
    </header>
    <div className={cn("gdy-kanban-column-body", classNames?.columnBody)}>
      {buildPlaceholderKeys(cardCount).map((key) => (
        <KanbanCardSkeleton key={key} />
      ))}
    </div>
  </section>
);

// The known columns keep their real title (no count: it is not known yet); before the first
// data there is none, so placeholder columns stand in for them.
const resolveLoadingLabels = <TData,>({ state, view }: KanbanSectionProps<TData>) => {
  const values = state.visibleColumnValues;
  if (values.length === 0) return Array.from({ length: PLACEHOLDER_COLUMN_COUNT }, () => undefined);
  return values.map((value) => resolveColumnLabel(state.groupColumns, value, view.labels.emptyValue));
};

export const KanbanLoadingColumns = <TData,>({ state, view }: KanbanSectionProps<TData>) => {
  const cardCount = resolveLoadingRowCount(view.loadingRowCount);
  return (
    <div className="gdy-kanban-board">
      {resolveLoadingLabels({ state, view }).map((label, index) => (
        <KanbanLoadingColumn key={label ?? `placeholder-${index}`} label={label} cardCount={cardCount} classNames={view.classNames} />
      ))}
    </div>
  );
};
