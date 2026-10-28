import { useMemo } from "react";
import {
  collectGroupColumns,
  groupCardsByValue,
  mergeColumnValues,
} from "./group-columns";
import type { FilterOption, KanbanGroupOption } from "../types";

interface GroupColumnsInput<TData> {
  selectedGroup: KanbanGroupOption<TData>;
  cards: TData[];
  visibleCards: TData[];
  emptyValueLabel: string;
  /** Only `renderColumnHeaderExtra` reads every card per column, so it is grouped only then. */
  groupAllCards: boolean;
}

const NO_CARDS_BY_GROUP: Record<string, never[]> = {};

const useAllCardsByGroup = <TData>(
  { selectedGroup, cards, groupAllCards }: GroupColumnsInput<TData>,
  groupColumns: FilterOption[],
): Record<string, TData[]> =>
  useMemo(
    () => (groupAllCards ? groupCardsByValue(selectedGroup, groupColumns, cards) : NO_CARDS_BY_GROUP),
    [groupAllCards, cards, selectedGroup, groupColumns],
  );

export const useGroupColumns = <TData>(input: GroupColumnsInput<TData>) => {
  const { selectedGroup, cards, visibleCards, emptyValueLabel } = input;
  const groupColumns = useMemo(
    () => collectGroupColumns(selectedGroup, cards, emptyValueLabel),
    [selectedGroup, cards, emptyValueLabel],
  );
  const cardsByGroup = useMemo(
    () => groupCardsByValue(selectedGroup, groupColumns, visibleCards),
    [visibleCards, selectedGroup, groupColumns],
  );
  const allCardsByGroup = useAllCardsByGroup(input, groupColumns);
  const visibleColumnValues = useMemo(
    () => mergeColumnValues(groupColumns, cardsByGroup),
    [groupColumns, cardsByGroup],
  );
  return { groupColumns, cardsByGroup, allCardsByGroup, visibleColumnValues };
};
