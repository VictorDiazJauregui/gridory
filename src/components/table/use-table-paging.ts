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
  useResetPageOnChange(pagination, settings, viewSnapshot);
  const wrapRef = useScrollResetOnPageChange(pagination, settings, viewSnapshot);
  const pagedRows = usePagedRows(flatRows, pagination, settings);
  const range = computePageRange(flatRows.length, pagination, settings);
  return { ...pagination, wrapRef, pagedRows, range };
};
