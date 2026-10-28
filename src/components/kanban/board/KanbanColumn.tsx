import { cn } from "../../../lib/cn";
import { buildColumnHookProps } from "./column-attributes";
import type { KanbanColumnProps } from "./column-settings";
import { buildColumnDropHandlers } from "./drag-handlers";
import { KanbanColumnBody } from "./KanbanColumnBody";

export const KanbanColumn = <TData,>(props: KanbanColumnProps<TData>) => {
  const { value, label, cards, drag, moveCard, classNames, columnHooks } = props;
  return (
    <section
      {...buildColumnHookProps(value, columnHooks)}
      data-drop-target={drag.dragOverValue === value || undefined}
      {...buildColumnDropHandlers({ drag, value, moveCard })}
    >
      <header className={cn("gdy-kanban-column-head", classNames?.columnHead)}>
        <span className="gdy-kanban-column-title" title={label}>
          {label}
        </span>
        <span className="gdy-kanban-column-count">{cards.length}</span>
      </header>
      <KanbanColumnBody {...props} />
    </section>
  );
};
