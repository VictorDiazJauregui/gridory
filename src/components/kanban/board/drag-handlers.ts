import type { DragEvent } from "react";
import type { KanbanCardClickEvent } from "../types";
import { NO_REJECTED_COLUMNS, type CardDragState } from "../model/use-card-drag";

interface ColumnDropInput {
  drag: CardDragState;
  value: string;
  moveCard: (cardId: string, toValue: string) => void;
}

const endDrag = (drag: CardDragState) => {
  drag.setDragOverValue(null);
  drag.setDraggingCardId(null);
  drag.setRejectedValues(NO_REJECTED_COLUMNS);
};

// Validated again on drop: the dragover check is not the only way a drop can arrive.
const buildDropHandler =
  ({ drag, value, moveCard }: ColumnDropInput) =>
  () => {
    if (!drag.enabled || !drag.draggingCardId) return;
    if (drag.isDropAllowed(drag.draggingCardId, value)) moveCard(drag.draggingCardId, value);
    endDrag(drag);
  };

const addRejectedColumn = (drag: CardDragState, value: string) => {
  drag.setRejectedValues((previous) => (previous.has(value) ? previous : new Set(previous).add(value)));
  drag.setDragOverValue((previous) => (previous === value ? null : previous));
};

// Without preventDefault the browser shows its "not allowed" cursor and never fires drop.
const buildDragOverHandler = ({ drag, value }: ColumnDropInput) => (event: DragEvent<HTMLElement>) => {
  if (!drag.enabled) return;
  if (drag.draggingCardId && !drag.isDropAllowed(drag.draggingCardId, value)) {
    addRejectedColumn(drag, value);
    return;
  }
  event.preventDefault();
  drag.setDragOverValue(value);
};

export const buildColumnDropHandlers = (input: ColumnDropInput) => {
  const { enabled, setDragOverValue } = input.drag;
  const { value } = input;
  return {
    onDragOver: buildDragOverHandler(input),
    onDragLeave: () => {
      if (!enabled) return;
      setDragOverValue((previous) => (previous === value ? null : previous));
    },
    onDrop: buildDropHandler(input),
  };
};

export const buildColumnDropState = (drag: CardDragState, value: string) => {
  const rejected = drag.rejectedValues.has(value);
  return {
    "data-drop-target": (drag.dragOverValue === value && !rejected) || undefined,
    "data-drop-disabled": rejected || undefined,
  };
};

interface CardDragInput {
  drag: CardDragState;
  cardId: string;
}

// Only with canDrop: every column it rejects is marked from the start, before the pointer gets there.
const markRejectedColumns = ({ drag, cardId }: CardDragInput) => {
  const rejected = drag.columnValues.filter((value) => !drag.isDropAllowed(cardId, value));
  if (rejected.length > 0) drag.setRejectedValues(new Set(rejected));
};

export const buildCardDragHandlers = ({ drag, cardId }: CardDragInput) => ({
  onDragStart: (event: DragEvent<HTMLElement>) => {
    if (!drag.enabled) return;
    drag.dragHappenedRef.current = true;
    event.dataTransfer.setData("text/plain", cardId);
    event.dataTransfer.effectAllowed = "move";
    drag.setDraggingCardId(cardId);
    markRejectedColumns({ drag, cardId });
  },
  onDragEnd: () => {
    endDrag(drag);
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
