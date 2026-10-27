import { computePageRange } from "./page-range";
import type { TableSettings } from "../settings";
import { usePagedRows } from "./use-paged-rows";
import { useResetPageOnChange } from "./use-reset-page-on-change";
import { useScrollResetOnPageChange } from "./use-scroll-reset-on-page-change";
import { useTablePagination } from "./use-table-pagination";
import type { TableState } from "../model/use-table-state";
import { useViewSnapshot } from "./use-view-snapshot";
import { usePrintMedia } from "../model/use-print-media";

// While `printMode="all"` prints, the page window is lifted: every filtered row is rendered.
const withoutPagination = <TData>(settings: TableSettings<TData>): TableSettings<TData> => ({
  ...settings,
  flags: { ...settings.flags, pagination: false },
});

export const useTablePaging = <TData>(
  flatRows: TData[],
  settings: TableSettings<TData>,
  state: TableState,
) => {
  const pagination = useTablePagination(flatRows.length, settings);
  const viewSnapshot = useViewSnapshot(state);
  useResetPageOnChange(pagination, settings, viewSnapshot);
  const wrapRef = useScrollResetOnPageChange(pagination, settings, viewSnapshot);
  const printingAllRows = usePrintMedia(settings.printMode === "all" && !settings.manualPagination);
  const pageSettings = printingAllRows ? withoutPagination(settings) : settings;
  const pagedRows = usePagedRows(flatRows, pagination, pageSettings);
  const range = computePageRange(flatRows.length, pagination, pageSettings);
  return { ...pagination, wrapRef, pagedRows, range, printingAllRows };
};
