import { cn } from "../../../lib/cn";
import type { KanbanCardProps } from "../board/column-settings";
import {
  buildCardClickHandler,
  buildCardDragHandlers,
} from "../board/drag-handlers";
import { KanbanCardContent } from "./KanbanCardContent";

export const KanbanCard = <TData,>(props: KanbanCardProps<TData>) => {
  const { card, cardId, groupValue, drag, group, onCardClick, cardClassName, pending } = props;
  const clickEvent = { card, cardId, groupId: group.id, value: groupValue };
  const draggable = drag.enabled && !pending;
  return (
    <article
      className={cn("gdy-kanban-card", cardClassName)}
      data-dragging={drag.draggingCardId === cardId || undefined}
      data-draggable={draggable || undefined}
      data-pending={pending || undefined}
      aria-busy={pending || undefined}
      draggable={draggable}
      {...buildCardDragHandlers({ drag, cardId })}
      onClick={buildCardClickHandler({ drag, onCardClick, ...clickEvent })}
    >
      <KanbanCardContent {...props} />
    </article>
  );
};
