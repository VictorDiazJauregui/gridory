import { useEffect, useRef } from "react";
import { useLatestRef } from "../../shared/use-latest-ref";
import type { TableSettings } from "../settings";
import type { PageNavigation } from "./use-table-pagination";
import type { ViewSnapshot } from "./use-view-snapshot";

// Runs only when the view really changes, never on mount: a controlled page reports its reset, so a
// first run would throw away the page the app mounted the table on.
export const useResetPageOnChange = <TData>(
  { resetToFirstPage }: PageNavigation,
  { manualPagination }: TableSettings<TData>,
  viewSnapshot: ViewSnapshot,
) => {
  const resetRef = useLatestRef(resetToFirstPage);
  const previousRef = useRef({ manualPagination, viewSnapshot });
  useEffect(() => {
    const previous = previousRef.current;
    if (previous.manualPagination === manualPagination && previous.viewSnapshot === viewSnapshot) return;
    previousRef.current = { manualPagination, viewSnapshot };
    if (manualPagination) return;
    resetRef.current();
  }, [manualPagination, viewSnapshot, resetRef]);
};
