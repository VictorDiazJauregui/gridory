import { useEffect } from "react";
import type { TableSettings } from "../settings";
import type { PageNavigation } from "./use-table-pagination";
import type { ViewSnapshot } from "./use-view-snapshot";

export const useResetPageOnChange = <TData>(
  { setPageIndex }: PageNavigation,
  { manualPagination }: TableSettings<TData>,
  viewSnapshot: ViewSnapshot,
) => {
  useEffect(() => {
    if (manualPagination) return;
    setPageIndex(0);
  }, [manualPagination, setPageIndex, viewSnapshot]);
};
