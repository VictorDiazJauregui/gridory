import { useEffect, useRef, type RefObject } from "react";
import type { ColumnFiltersState, ColumnSortingState } from "../../shared/data-model";
import type { PageNavigation } from "../pagination/use-table-pagination";
import type { TableSettings } from "../settings";

// Sort and filter exist before the paging (its page count depends on their rows): handlers reach it through
// a ref filled later. A server-side sort or filter starts again from the first page, like the local one.
export const useViewChangeHandlers = <TData>(settings: TableSettings<TData>) => {
  const pagingRef = useRef<PageNavigation | null>(null);
  const handleSortChange = (sorting: ColumnSortingState | null) => {
    settings.onSortChange?.(sorting);
    if (settings.manualSorting) pagingRef.current?.returnToFirstPage();
  };
  const handleFiltersChange = (filters: ColumnFiltersState) => {
    settings.onFiltersChange?.(filters);
    if (settings.manualFiltering) pagingRef.current?.returnToFirstPage();
  };
  return { handleSortChange, handleFiltersChange, pagingRef };
};

export type ViewChangeHandlers = ReturnType<typeof useViewChangeHandlers>;

export const useBindViewPaging = (
  pagingRef: RefObject<PageNavigation | null>,
  paging: PageNavigation,
) => {
  useEffect(() => {
    pagingRef.current = paging;
  });
};
