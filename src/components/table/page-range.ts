import type { TableSettings } from "./settings";
import type { PageWindow } from "./use-table-pagination";

export const computePageRange = <TData>(
  localRowCount: number,
  { pageIndex, pageSize }: PageWindow,
  settings: TableSettings<TData>,
) => {
  const { manualPagination, serverRowCount, flags } = settings;
  const totalRows = manualPagination
    ? (serverRowCount ?? localRowCount)
    : localRowCount;
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = flags.pagination
    ? Math.min((pageIndex + 1) * pageSize, totalRows)
    : totalRows;
  return { totalRows, from, to };
};
