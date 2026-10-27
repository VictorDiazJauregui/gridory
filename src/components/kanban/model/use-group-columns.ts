import { useMemo } from "react";
import {
  collectGroupColumns,
  groupCardsByValue,
  mergeColumnValues,
} from "./group-columns";
import type { KanbanGroupOption } from "../types";

interface GroupColumnsInput<TData> {
  selectedGroup: KanbanGroupOption<TData>;
  cards: TData[];
  visibleCards: TData[];
  emptyValueLabel: string;
}

export const useGroupColumns = <TData>({
  selectedGroup,
  cards,
  visibleCards,
  emptyValueLabel,
}: GroupColumnsInput<TData>) => {
  const groupColumns = useMemo(
    () => collectGroupColumns(selectedGroup, cards, emptyValueLabel),
    [selectedGroup, cards, emptyValueLabel],
  );
  const cardsByGroup = useMemo(
    () => groupCardsByValue(selectedGroup, groupColumns, visibleCards),
    [visibleCards, selectedGroup, groupColumns],
  );
  const visibleColumnValues = useMemo(
    () => mergeColumnValues(groupColumns, cardsByGroup),
    [groupColumns, cardsByGroup],
  );
  return { groupColumns, cardsByGroup, visibleColumnValues };
};
