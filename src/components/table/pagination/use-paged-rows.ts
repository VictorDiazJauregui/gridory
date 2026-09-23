import { useMemo } from "react";
import type { TableSettings } from "../settings";
import type { PageWindow } from "./use-table-pagination";

export const usePagedRows = <TData>(
  flatRows: TData[],
  { pageIndex, pageSize }: PageWindow,
  settings: TableSettings<TData>,
) => {
  const { manualPagination } = settings;
  const enabled = settings.flags.pagination;
  return useMemo(() => {
    if (!enabled || manualPagination) return flatRows;
    const from = pageIndex * pageSize;
    return flatRows.slice(from, from + pageSize);
  }, [flatRows, pageIndex, pageSize, enabled, manualPagination]);
};
