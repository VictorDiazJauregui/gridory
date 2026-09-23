import type { DragEvent } from "react";
import type { KanbanCardClickEvent } from "../types";
import type { CardDragState } from "../model/use-card-drag";

interface ColumnDropInput {
  drag: CardDragState;
  value: string;
  moveCard: (cardId: string, toValue: string) => void;
}

const buildDropHandler =
  ({ drag, value, moveCard }: ColumnDropInput) =>
  () => {
    if (!drag.enabled || !drag.draggingCardId) return;
    moveCard(drag.draggingCardId, value);
    drag.setDragOverValue(null);
    drag.setDraggingCardId(null);
  };

export const buildColumnDropHandlers = (input: ColumnDropInput) => {
  const { enabled, setDragOverValue } = input.drag;
  const { value } = input;
  return {
    onDragOver: (event: DragEvent<HTMLElement>) => {
      if (!enabled) return;
      event.preventDefault();
      setDragOverValue(value);
    },
    onDragLeave: () => {
      if (!enabled) return;
      setDragOverValue((previous) => (previous === value ? null : previous));
    },
    onDrop: buildDropHandler(input),
  };
};

interface CardDragInput {
  drag: CardDragState;
  cardId: string;
}

export const buildCardDragHandlers = ({ drag, cardId }: CardDragInput) => ({
  onDragStart: (event: DragEvent<HTMLElement>) => {
    if (!drag.enabled) return;
    drag.dragHappenedRef.current = true;
    event.dataTransfer.setData("text/plain", cardId);
    event.dataTransfer.effectAllowed = "move";
    drag.setDraggingCardId(cardId);
  },
  onDragEnd: () => {
    drag.setDraggingCardId(null);
    drag.setDragOverValue(null);
    setTimeout(() => {
      drag.dragHappenedRef.current = false;
    }, 0);
  },
});

interface CardClickInput<TData> extends KanbanCardClickEvent<TData> {
  drag: CardDragState;
  onCardClick?: (event: KanbanCardClickEvent<TData>) => void;
}

export const buildCardClickHandler =
  <TData>(input: CardClickInput<TData>) =>
  () => {
    const { drag, onCardClick, card, cardId, groupId, value } = input;
    if (drag.dragHappenedRef.current) {
      drag.dragHappenedRef.current = false;
      return;
    }
    onCardClick?.({ card, cardId, groupId, value });
  };
