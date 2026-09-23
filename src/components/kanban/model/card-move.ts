import type { Dispatch, SetStateAction } from "react";
import { getGroupValue } from "./group-columns";
import type {
  KanbanBoardProps,
  KanbanGroupOption,
  KanbanMoveEvent,
} from "../types";

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

interface CardMoverInput<TData> {
  cards: TData[];
  setCards: Dispatch<SetStateAction<TData[]>>;
  selectedGroup: KanbanGroupOption<TData>;
  view: Pick<KanbanBoardProps<TData>, "getCardId" | "onCardMove">;
}

export const buildCardMover = <TData>({
  cards,
  setCards,
  selectedGroup,
  view,
}: CardMoverInput<TData>) => {
  const { getCardId, onCardMove } = view;
  const resolveCardId = (card: TData) => {
    const index = cards.indexOf(card);
    return getCardId(card, index >= 0 ? index : 0);
  };
  const moveCard = (cardId: string, toValue: string) => {
    const move = { cards, getCardId, group: selectedGroup, cardId, toValue };
    const event = planCardMove(move);
    if (!event) return;
    setCards(replaceCard(getCardId, cardId, event.updatedCard));
    onCardMove?.(event);
  };
  return { resolveCardId, moveCard };
};
