import type { PageWindow, PagingSettings } from "./use-table-pagination";

export const computePageRange = (localRowCount: number, { pageIndex, pageSize }: PageWindow, settings: PagingSettings) => {
  const { manualPagination, serverRowCount, flags } = settings;
  const totalRows = manualPagination
    ? (serverRowCount ?? localRowCount)
    : localRowCount;
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = flags.pagination
    ? Math.min((pageIndex + 1) * pageSize, totalRows)
    : totalRows;
  const pageStartIndex = flags.pagination ? pageIndex * pageSize : 0;
  return { totalRows, from, to, pageStartIndex };
};
