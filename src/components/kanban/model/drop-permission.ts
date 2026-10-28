import { findCardIndex } from "./card-move";
import { getGroupValue } from "./group-columns";
import type { KanbanBoardProps, KanbanDropContext, KanbanGroupOption } from "../types";

interface DropPermissionInput<TData> {
  cards: TData[];
  group: KanbanGroupOption<TData>;
  view: Pick<KanbanBoardProps<TData>, "getCardId" | "canDrop" | "getDropDisabledReason">;
}

export type DropPermission = (cardId: string, toValue: string) => boolean;

export type DropRejectionReason = (cardId: string, toValue: string) => string | undefined;

// Null when there is nothing to ask: the card is gone, or the column is its own (dropping there does
// nothing, so canDrop is never asked about it).
const resolveDropContext = <TData>(
  { cards, group, view }: DropPermissionInput<TData>,
  cardId: string,
  toValue: string,
): KanbanDropContext<TData> | null => {
  const index = findCardIndex(cards, view.getCardId, cardId);
  if (index < 0) return null;
  const card = cards[index];
  const fromValue = getGroupValue(group, card);
  if (fromValue === toValue) return null;
  return { card, cardId, groupId: group.id, fromValue, toValue };
};

// The single place that asks canDrop, so dragging and any other way of moving a card (the "Move to"
// menu) disable the same columns.
export const buildDropPermission =
  <TData>(input: DropPermissionInput<TData>): DropPermission =>
  (cardId, toValue) => {
    if (!input.view.canDrop) return true;
    const context = resolveDropContext(input, cardId, toValue);
    return context === null || input.view.canDrop(context);
  };

/** Asked only for a column the permission already rejected. */
export const buildDropRejectionReason =
  <TData>(input: DropPermissionInput<TData>): DropRejectionReason =>
  (cardId, toValue) => {
    if (!input.view.getDropDisabledReason) return undefined;
    const context = resolveDropContext(input, cardId, toValue);
    return context === null ? undefined : input.view.getDropDisabledReason(context);
  };
