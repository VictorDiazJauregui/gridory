import { computePageRange } from "./page-range";
import type { TableSettings } from "./settings";
import { usePagedRows } from "./use-paged-rows";
import { useResetPageOnChange } from "./use-reset-page-on-change";
import { useScrollResetOnPageChange } from "./use-scroll-reset-on-page-change";
import { useTablePagination } from "./use-table-pagination";
import type { TableState } from "./use-table-state";
import { useViewSnapshot } from "./use-view-snapshot";

export const useTablePaging = <TData>(
  flatRows: TData[],
  settings: TableSettings<TData>,
  state: TableState,
) => {
  const pagination = useTablePagination(flatRows.length, settings);
  const viewSnapshot = useViewSnapshot(state);
  useResetPageOnChange(
    pagination.setPageIndex,
    settings.manualPagination,
    viewSnapshot,
  );
  const { scrollResetOnPageChange, flags } = settings;
  const wrapRef = useScrollResetOnPageChange(
    pagination,
    scrollResetOnPageChange,
    viewSnapshot,
  );
  const pagedRows = usePagedRows(flatRows, pagination, settings);
  const pageStartIndex = flags.pagination
    ? pagination.pageIndex * pagination.pageSize
    : 0;
  const range = computePageRange(flatRows.length, pagination, settings);
  return { ...pagination, wrapRef, pagedRows, pageStartIndex, range };
};
