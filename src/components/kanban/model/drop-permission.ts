import { findCardIndex } from "./card-move";
import { getGroupValue } from "./group-columns";
import type { KanbanBoardProps, KanbanGroupOption } from "../types";

interface DropPermissionInput<TData> {
  cards: TData[];
  group: KanbanGroupOption<TData>;
  view: Pick<KanbanBoardProps<TData>, "getCardId" | "canDrop">;
}

/** Whether the card may land on the column with that value. */
export type DropPermission = (cardId: string, toValue: string) => boolean;

// The single place that asks canDrop, so dragging and any other way of moving a card (the "Move to"
// menu) disable the same columns. The card's own column is never asked: dropping there does nothing.
export const buildDropPermission =
  <TData>({ cards, group, view }: DropPermissionInput<TData>): DropPermission =>
  (cardId, toValue) => {
    if (!view.canDrop) return true;
    const index = findCardIndex(cards, view.getCardId, cardId);
    if (index < 0) return true;
    const card = cards[index];
    const fromValue = getGroupValue(group, card);
    if (fromValue === toValue) return true;
    return view.canDrop({ card, cardId, groupId: group.id, fromValue, toValue });
  };
