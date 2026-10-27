import { useEffect, useRef, type RefObject } from "react";
import type { ColumnSortingState } from "../../shared/data-model";
import type { PageNavigation } from "../pagination/use-table-pagination";
import type { TableSettings } from "../settings";

const returnToFirstPage = <TData>(paging: PageNavigation | null, settings: TableSettings<TData>) => {
  if (!paging || paging.pageIndex === 0) return;
  paging.setPageIndex(0);
  settings.onPaginationChange?.({ pageIndex: 0, pageSize: paging.pageSize });
};

// The sort state is created before the paging (the page count depends on the sorted rows), so
// the handler reaches the paging through a ref that the table fills once it exists.
export const useSortChangeHandler = <TData>(settings: TableSettings<TData>) => {
  const pagingRef = useRef<PageNavigation | null>(null);
  const handleSortChange = (sorting: ColumnSortingState | null) => {
    settings.onSortChange?.(sorting);
    if (settings.manualSorting) returnToFirstPage(pagingRef.current, settings);
  };
  return { handleSortChange, pagingRef };
};

export const useBindSortPaging = (
  pagingRef: RefObject<PageNavigation | null>,
  paging: PageNavigation,
) => {
  useEffect(() => {
    pagingRef.current = paging;
  });
};
