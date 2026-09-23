import { getGroupValue } from "./group-columns";
import type { KanbanGroupOption, KanbanMoveEvent } from "./types";

type CardIdResolver<TData> = (card: TData, index: number) => string;

interface CardMovePlan<TData> {
  cards: TData[];
  getCardId: CardIdResolver<TData>;
  group: KanbanGroupOption<TData>;
  cardId: string;
  toValue: string;
}

export const planCardMove = <TData>({
  cards,
  getCardId,
  group,
  cardId,
  toValue,
}: CardMovePlan<TData>): KanbanMoveEvent<TData> | null => {
  const sourceIndex = cards.findIndex(
    (card, index) => getCardId(card, index) === cardId,
  );
  if (sourceIndex < 0) return null;
  const card = cards[sourceIndex];
  const fromValue = getGroupValue(group, card);
  if (fromValue === toValue) return null;
  const updatedCard = group.setValue(card, toValue);
  return { card, updatedCard, cardId, groupId: group.id, fromValue, toValue };
};

export const replaceCard =
  <TData>(
    getCardId: CardIdResolver<TData>,
    cardId: string,
    replacement: TData,
  ) =>
  (previousCards: TData[]) =>
    previousCards.map((card, index) =>
      getCardId(card, index) === cardId ? replacement : card,
    );
