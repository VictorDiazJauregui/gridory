import { useCallback, useState } from "react";

const withId = (ids: ReadonlySet<string>, cardId: string) => new Set(ids).add(cardId);

const withoutId = (ids: ReadonlySet<string>, cardId: string) => {
  const next = new Set(ids);
  next.delete(cardId);
  return next;
};

/** Ids of the cards whose move waits for the promise `onCardMove` returned. */
export const usePendingCards = () => {
  const [pendingIds, setPendingIds] = useState<ReadonlySet<string>>(() => new Set());
  const markPending = useCallback((cardId: string) => setPendingIds((ids) => withId(ids, cardId)), []);
  const clearPending = useCallback((cardId: string) => setPendingIds((ids) => withoutId(ids, cardId)), []);
  return { pendingIds, markPending, clearPending };
};

export type PendingCards = ReturnType<typeof usePendingCards>;
