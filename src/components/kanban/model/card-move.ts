import type { Dispatch, RefObject, SetStateAction } from "react";
import { getGroupValue } from "./group-columns";
import type { PendingCards } from "./use-pending-cards";
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

export const findCardIndex = <TData>(cards: TData[], getCardId: CardIdResolver<TData>, cardId: string) =>
  cards.findIndex((card, index) => getCardId(card, index) === cardId);

export const planCardMove = <TData>({
  cards,
  getCardId,
  group,
  cardId,
  toValue,
}: CardMovePlan<TData>): KanbanMoveEvent<TData> | null => {
  const sourceIndex = findCardIndex(cards, getCardId, cardId);
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

type CardMoveResult = ReturnType<NonNullable<KanbanBoardProps<unknown>["onCardMove"]>>;

interface CardMoverInput<TData> {
  cards: TData[];
  setCards: Dispatch<SetStateAction<TData[]>>;
  selectedGroup: KanbanGroupOption<TData>;
  view: Pick<KanbanBoardProps<TData>, "getCardId" | "onCardMove" | "onCardMoveError">;
  pending: PendingCards;
  /** Cards of the last `data`: a different array when the move settles means new data arrived. */
  inputCardsRef: RefObject<TData[]>;
}

/** Told what became of one move: the "Move to" menu announces it and keeps the focus on the card. */
export interface CardMoveObserver<TData> {
  onMoved: (event: KanbanMoveEvent<TData>) => void;
  onReverted: (event: KanbanMoveEvent<TData>) => void;
}

interface PendingMove<TData> extends CardMoverInput<TData> {
  event: KanbanMoveEvent<TData>;
  inputCardsAtDrop: TData[];
  observer?: CardMoveObserver<TData>;
}

const isPromiseLike = (result: CardMoveResult): result is Promise<void | boolean> =>
  typeof (result as Promise<void | boolean> | undefined)?.then === "function";

// New data wins: if `data` changed while the promise was pending, it already holds the truth.
const revertMove = <TData>(move: PendingMove<TData>) => {
  if (move.inputCardsRef.current !== move.inputCardsAtDrop) return;
  move.setCards(replaceCard(move.view.getCardId, move.event.cardId, move.event.card));
  move.observer?.onReverted(move.event);
};

// Without onCardMoveError the error is thrown again, so it reaches the console and error monitoring.
const reportMoveError = <TData>(error: unknown, move: PendingMove<TData>) => {
  if (!move.view.onCardMoveError) throw error;
  move.view.onCardMoveError(error, move.event);
};

const settlePendingMove = async <TData>(result: Promise<void | boolean>, move: PendingMove<TData>) => {
  move.pending.markPending(move.event.cardId);
  try {
    if ((await result) === false) revertMove(move);
  } catch (error) {
    revertMove(move);
    reportMoveError(error, move);
  } finally {
    move.pending.clearPending(move.event.cardId);
  }
};

/** Moves a card to the column with that value; the observer hears whether it stayed. */
export type MoveCard<TData> = (cardId: string, toValue: string, observer?: CardMoveObserver<TData>) => void;

const buildMoveCard =
  <TData>(input: CardMoverInput<TData>): MoveCard<TData> =>
  (cardId, toValue, observer) => {
    const { cards, selectedGroup, view, pending } = input;
    if (pending.pendingIds.has(cardId)) return;
    const event = planCardMove({ cards, getCardId: view.getCardId, group: selectedGroup, cardId, toValue });
    if (!event) return;
    const result = view.onCardMove?.(event);
    if (result === false) {
      observer?.onReverted(event);
      return;
    }
    input.setCards(replaceCard(view.getCardId, cardId, event.updatedCard));
    observer?.onMoved(event);
    if (!isPromiseLike(result)) return;
    void settlePendingMove(result, { ...input, event, inputCardsAtDrop: input.inputCardsRef.current, observer });
  };

export const buildCardMover = <TData>(input: CardMoverInput<TData>) => {
  const { cards, view } = input;
  const resolveCardId = (card: TData) => {
    const index = cards.indexOf(card);
    return view.getCardId(card, index >= 0 ? index : 0);
  };
  return { resolveCardId, moveCard: buildMoveCard(input), pendingIds: input.pending.pendingIds };
};
