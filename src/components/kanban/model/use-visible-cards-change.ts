import { useEffect, useRef } from "react";
import { isSameRowList } from "../../shared/rows/same-row-list";
import { useLatestRef } from "../../shared/use-latest-ref";
import type { KanbanBoardView } from "../board-view";
import type { KanbanVisibleCardsState } from "../types";

interface VisibleCardsSources<TData> {
  visibleCards: TData[];
  cardsByGroup: Record<string, TData[]>;
  visibleColumnValues: string[];
}

const buildVisibleCardsState = <TData>(sources: VisibleCardsSources<TData>): KanbanVisibleCardsState<TData> => ({
  cards: sources.visibleCards,
  byColumn: Object.fromEntries(sources.visibleColumnValues.map((value) => [value, sources.cardsByGroup[value] ?? []])),
});

const isSameByColumn = <TData>(previous: Record<string, TData[]>, next: Record<string, TData[]>) => {
  const values = Object.keys(next);
  if (!isSameRowList(Object.keys(previous), values)) return false;
  return values.every((value) => isSameRowList(previous[value], next[value]));
};

const isSameVisibleCards = <TData>(
  previous: KanbanVisibleCardsState<TData> | undefined,
  next: KanbanVisibleCardsState<TData>,
) => previous !== undefined && isSameRowList(previous.cards, next.cards) && isSameByColumn(previous.byColumn, next.byColumn);

// Compares against the last emitted state instead of trusting memo identities: an inline `data`
// recomputes every array on each render of the parent without changing a card.
export const useVisibleCardsChange = <TData>(sources: VisibleCardsSources<TData>, view: KanbanBoardView<TData>) => {
  const { visibleCards, cardsByGroup, visibleColumnValues } = sources;
  const callbackRef = useLatestRef(view.onVisibleCardsChange);
  const lastEmittedRef = useRef<KanbanVisibleCardsState<TData>>(undefined);
  useEffect(() => {
    if (!callbackRef.current || view.loading) return;
    const next = buildVisibleCardsState({ visibleCards, cardsByGroup, visibleColumnValues });
    if (isSameVisibleCards(lastEmittedRef.current, next)) return;
    lastEmittedRef.current = next;
    callbackRef.current(next);
  }, [visibleCards, cardsByGroup, visibleColumnValues, view.loading, callbackRef]);
};
