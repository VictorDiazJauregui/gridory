import { useMemo, useState } from "react";
import {
  computeColumnFilterOptions,
  normalizeInputRows,
} from "../../shared/rows/row-pipeline";
import { useLatestRef } from "../../shared/use-latest-ref";
import type { KanbanBoardProps } from "../types";

// Reset during render, not in an effect: new data reaches the cards in the same render, with no pass over the
// old ones (react.dev, "Adjusting some state when a prop changes").
const useCardsResetByInput = <TData>(inputCards: TData[]) => {
  const [cards, setCards] = useState(inputCards);
  const [cardsSource, setCardsSource] = useState(inputCards);
  if (cardsSource !== inputCards) {
    setCardsSource(inputCards);
    setCards(inputCards);
  }
  return [cards, setCards] as const;
};

export const useKanbanCards = <TData>({
  data,
  normalizeRow,
  fields,
}: KanbanBoardProps<TData>) => {
  const inputCards = useMemo(
    () => normalizeInputRows(data, normalizeRow),
    [data, normalizeRow],
  );
  const [cards, setCards] = useCardsResetByInput(inputCards);
  const filterOptions = useMemo(
    () => computeColumnFilterOptions(fields, cards),
    [fields, cards],
  );
  return { cards, setCards, filterOptions, inputCardsRef: useLatestRef(inputCards) };
};
