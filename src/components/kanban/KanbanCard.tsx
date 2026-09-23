import type { KanbanCardProps } from "./column-settings";
import {
  buildCardClickHandler,
  buildCardDragHandlers,
} from "./drag-handlers";
import { KanbanCardContent } from "./KanbanCardContent";

export const KanbanCard = <TData,>(props: KanbanCardProps<TData>) => {
  const { card, cardId, groupValue, drag, group, onCardClick } = props;
  const clickEvent = { card, cardId, groupId: group.id, value: groupValue };
  return (
    <article
      className="gdy-kanban-card"
      data-dragging={drag.draggingCardId === cardId || undefined}
      draggable={drag.enabled}
      {...buildCardDragHandlers({ drag, cardId })}
      onClick={buildCardClickHandler({ drag, onCardClick, ...clickEvent })}
    >
      <KanbanCardContent {...props} />
    </article>
  );
};
