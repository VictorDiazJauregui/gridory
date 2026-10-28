import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import type { KanbanColumnProps } from "./column-settings";

const isRenderable = (content: ReactNode) => content !== null && content !== undefined && typeof content !== "boolean";

const KanbanColumnExtra = <TData,>(props: KanbanColumnProps<TData>) => {
  const { value, label, groupId, cards, allCards, renderColumnHeaderExtra } = props;
  const extra = renderColumnHeaderExtra?.({ value, label, groupId, cards, allCards });
  if (!isRenderable(extra)) return null;
  return <span className="gdy-kanban-column-extra">{extra}</span>;
};

export const KanbanColumnHead = <TData,>(props: KanbanColumnProps<TData>) => (
  <header className={cn("gdy-kanban-column-head", props.classNames?.columnHead)}>
    <span className="gdy-kanban-column-title" title={props.label}>
      {props.label}
    </span>
    <KanbanColumnExtra {...props} />
    <span className="gdy-kanban-column-count">{props.cards.length}</span>
  </header>
);
