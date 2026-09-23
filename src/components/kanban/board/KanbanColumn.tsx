import type { KanbanColumnProps } from "./column-settings";
import { buildColumnDropHandlers } from "./drag-handlers";
import { KanbanColumnBody } from "./KanbanColumnBody";

export const KanbanColumn = <TData,>(props: KanbanColumnProps<TData>) => {
  const { value, label, cards, drag, moveCard } = props;
  return (
    <section
      className="gdy-kanban-column"
      data-drop-target={drag.dragOverValue === value || undefined}
      {...buildColumnDropHandlers({ drag, value, moveCard })}
    >
      <header className="gdy-kanban-column-head">
        <span className="gdy-kanban-column-title" title={label}>
          {label}
        </span>
        <span className="gdy-kanban-column-count">{cards.length}</span>
      </header>
      <KanbanColumnBody {...props} />
    </section>
  );
};
