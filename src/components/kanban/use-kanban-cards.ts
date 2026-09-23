import { useEffect, useMemo, useState } from "react";
import {
  computeColumnFilterOptions,
  normalizeInputRows,
} from "../shared/row-pipeline";
import type { KanbanBoardProps } from "./types";

export const useKanbanCards = <TData>({
  data,
  normalizeRow,
  fields,
}: KanbanBoardProps<TData>) => {
  const inputCards = useMemo(
    () => normalizeInputRows(data, normalizeRow),
    [data, normalizeRow],
  );
  const [cards, setCards] = useState<TData[]>(inputCards);
  useEffect(() => {
    setCards(inputCards);
  }, [inputCards]);
  const filterOptions = useMemo(
    () => computeColumnFilterOptions(fields, cards),
    [fields, cards],
  );
  return { cards, setCards, filterOptions };
};
