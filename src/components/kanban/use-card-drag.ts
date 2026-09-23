import { useRef, useState } from "react";

export const useCardDrag = (enabled: boolean) => {
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dragOverValue, setDragOverValue] = useState<string | null>(null);
  const dragHappenedRef = useRef<boolean>(false);
  return {
    enabled,
    draggingCardId,
    setDraggingCardId,
    dragOverValue,
    setDragOverValue,
    dragHappenedRef,
  };
};

export type CardDragState = ReturnType<typeof useCardDrag>;
