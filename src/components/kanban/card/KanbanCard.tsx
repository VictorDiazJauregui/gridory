import { cn } from "../../../lib/cn";
import type { KanbanCardProps } from "../board/column-settings";
import {
  buildCardClickHandler,
  buildCardDragHandlers,
} from "../board/drag-handlers";
import { KanbanCardContent } from "./KanbanCardContent";

export const KanbanCard = <TData,>(props: KanbanCardProps<TData>) => {
  const { card, cardId, groupValue, drag, group, onCardClick, cardClassName } = props;
  const clickEvent = { card, cardId, groupId: group.id, value: groupValue };
  return (
    <article
      className={cn("gdy-kanban-card", cardClassName)}
      data-dragging={drag.draggingCardId === cardId || undefined}
      data-draggable={drag.enabled || undefined}
      draggable={drag.enabled}
      {...buildCardDragHandlers({ drag, cardId })}
      onClick={buildCardClickHandler({ drag, onCardClick, ...clickEvent })}
    >
      <KanbanCardContent {...props} />
    </article>
  );
};
