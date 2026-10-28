import { cn } from "../../../lib/cn";
import { buildPlaceholderKeys, resolveLoadingRowCount } from "../../shared/loading/loading-state";
import { SkeletonBar } from "../../shared/loading/SkeletonBar";
import { resolveColumnLabel } from "../model/group-columns";
import { buildColumnHookProps, type ColumnHookSettings } from "./column-attributes";
import type { KanbanSectionProps } from "../model/use-kanban-board-state";

const PLACEHOLDER_COLUMN_COUNT = 3;

interface LoadingColumn {
  /** Undefined for the placeholder columns shown before the first data. */
  value?: string;
  label?: string;
}

interface LoadingColumnProps extends LoadingColumn {
  cardCount: number;
  hooks: ColumnHookSettings;
}

const KanbanCardSkeleton = () => (
  <article className="gdy-kanban-card-skeleton" aria-hidden="true">
    <SkeletonBar />
    <SkeletonBar />
    <SkeletonBar />
  </article>
);

const resolveSectionProps = ({ value, hooks }: LoadingColumnProps) =>
  value === undefined
    ? { className: cn("gdy-kanban-column", hooks.classNames?.column) }
    : buildColumnHookProps(value, hooks);

const KanbanLoadingColumn = (props: LoadingColumnProps) => (
  <section {...resolveSectionProps(props)}>
    <header className={cn("gdy-kanban-column-head", props.hooks.classNames?.columnHead)}>
      <span className="gdy-kanban-column-title" title={props.label}>
        {props.label ?? <SkeletonBar />}
      </span>
    </header>
    <div className={cn("gdy-kanban-column-body", props.hooks.classNames?.columnBody)}>
      {buildPlaceholderKeys(props.cardCount).map((key) => (
        <KanbanCardSkeleton key={key} />
      ))}
    </div>
  </section>
);

// The known columns keep their real title and value (no count: it is not known yet); before the
// first data there is none, so placeholder columns stand in for them.
const resolveLoadingColumns = <TData,>({ state, view }: KanbanSectionProps<TData>): LoadingColumn[] => {
  const values = state.visibleColumnValues;
  if (values.length === 0) return Array.from({ length: PLACEHOLDER_COLUMN_COUNT }, () => ({}));
  return values.map((value) => ({
    value,
    label: resolveColumnLabel(state.groupColumns, value, view.labels.emptyValue),
  }));
};

export const KanbanLoadingColumns = <TData,>({ state, view }: KanbanSectionProps<TData>) => {
  const cardCount = resolveLoadingRowCount(view.loadingRowCount);
  return (
    <div className="gdy-kanban-board">
      {resolveLoadingColumns({ state, view }).map((column, index) => (
        <KanbanLoadingColumn key={column.value ?? `placeholder-${index}`} {...column} cardCount={cardCount} hooks={view} />
      ))}
    </div>
  );
};
