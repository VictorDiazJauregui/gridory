import { useMemo } from "react";
import type { PageWindow, PagingSettings } from "./use-table-pagination";

export const usePagedRows = <TData>(
  flatRows: TData[],
  { pageIndex, pageSize }: PageWindow,
  settings: PagingSettings,
) => {
  const { manualPagination } = settings;
  const enabled = settings.flags.pagination;
  return useMemo(() => {
    if (!enabled || manualPagination) return flatRows;
    const from = pageIndex * pageSize;
    return flatRows.slice(from, from + pageSize);
  }, [flatRows, pageIndex, pageSize, enabled, manualPagination]);
};
