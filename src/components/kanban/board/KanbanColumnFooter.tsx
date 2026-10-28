import type { KanbanColumnProps } from "./column-settings";
import { isRenderable } from "./renderable-content";

/** Own content of `renderColumnFooter`, under the cards and outside their scroll. */
export const KanbanColumnFooter = <TData,>(props: KanbanColumnProps<TData>) => {
  const { value, label, groupId, cards, allCards, renderColumnFooter } = props;
  const footer = renderColumnFooter?.({ value, label, groupId, cards, allCards });
  if (!isRenderable(footer)) return null;
  return <div className="gdy-kanban-column-footer">{footer}</div>;
};
