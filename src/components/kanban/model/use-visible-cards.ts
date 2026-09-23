import type {
  ArchivedViewMode,
  ColumnSortingState,
  DateFilterState,
} from "../../shared/data-model";
import { useArchivedRows } from "../../shared/use-archived-rows";
import { useFilteredRows } from "../../shared/use-filtered-rows";
import { useSearchedRows } from "../../shared/use-searched-rows";
import { useSortedRows } from "../../shared/use-sorted-rows";
import type { KanbanBoardView } from "../board-view";

interface VisibleCardsInput<TData> {
  cards: TData[];
  view: KanbanBoardView<TData>;
  search: string;
  archivedMode: ArchivedViewMode;
  filters: Record<string, string[]>;
  dateFilters: Record<string, DateFilterState>;
  sorting: ColumnSortingState | null;
}

const useSearchedCards = <TData>(input: VisibleCardsInput<TData>) => {
  const { cards, view, search, archivedMode } = input;
  const searched = useSearchedRows({
    rows: cards,
    columns: view.fields,
    query: search,
    enabled: view.flags.search,
  });
  return useArchivedRows({
    rows: searched,
    archivedView: view.archivedView,
    mode: archivedMode,
    rowActions: view.rowActions,
  });
};

export const useVisibleCards = <TData>(input: VisibleCardsInput<TData>) => {
  const { view, filters, dateFilters, sorting } = input;
  const searched = useSearchedCards(input);
  const filtered = useFilteredRows({
    rows: searched,
    columns: view.fields,
    filters,
    dateFilters,
    enabled: view.flags.filtering,
  });
  return useSortedRows({
    rows: filtered,
    columns: view.fields,
    sorting,
    enabled: view.flags.sorting,
  });
};
