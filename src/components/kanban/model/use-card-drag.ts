import { useRef, useState } from "react";
import type { DropPermission } from "./drop-permission";

interface CardDragInput {
  enabled: boolean;
  isDropAllowed: DropPermission;
  /** Columns on screen: the ones checked against `canDrop` when a drag starts. */
  columnValues: string[];
}

export const NO_REJECTED_COLUMNS: ReadonlySet<string> = new Set();

export const useCardDrag = ({ enabled, isDropAllowed, columnValues }: CardDragInput) => {
  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dragOverValue, setDragOverValue] = useState<string | null>(null);
  const [rejectedValues, setRejectedValues] = useState(NO_REJECTED_COLUMNS);
  const dragHappenedRef = useRef<boolean>(false);
  return {
    enabled,
    draggingCardId,
    setDraggingCardId,
    dragOverValue,
    setDragOverValue,
    rejectedValues,
    setRejectedValues,
    dragHappenedRef,
    isDropAllowed,
    columnValues,
  };
};

export type CardDragState = ReturnType<typeof useCardDrag>;
