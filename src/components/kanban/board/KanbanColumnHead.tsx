import { cn } from "../../../lib/cn";
import type { KanbanColumnProps } from "./column-settings";
import { KanbanColumnToggle } from "./KanbanColumnToggle";
import { isRenderable } from "./renderable-content";

interface KanbanColumnHeadProps<TData> extends KanbanColumnProps<TData> {
  collapsed: boolean;
}

const KanbanColumnExtra = <TData,>(props: KanbanColumnProps<TData>) => {
  const { value, label, groupId, cards, allCards, renderColumnHeaderExtra } = props;
  const extra = renderColumnHeaderExtra?.({ value, label, groupId, cards, allCards });
  if (!isRenderable(extra)) return null;
  return <span className="gdy-kanban-column-extra">{extra}</span>;
};

// A collapsed column is a narrow strip: the own content of the header does not fit, so it is not asked.
export const KanbanColumnHead = <TData,>(props: KanbanColumnHeadProps<TData>) => (
  <header className={cn("gdy-kanban-column-head", props.classNames?.columnHead)}>
    {props.collapse.enabled ? <KanbanColumnToggle {...props} /> : null}
    <span className="gdy-kanban-column-title" title={props.label}>
      {props.label}
    </span>
    {props.collapsed ? null : <KanbanColumnExtra {...props} />}
    <span className="gdy-kanban-column-count">{props.cards.length}</span>
  </header>
);
