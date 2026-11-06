import { useEffect, useRef } from "react";
import { useLatestRef } from "../../shared/use-latest-ref";
import type { PageNavigation, PagingSettings } from "./use-table-pagination";

// Runs only when the view really changes, never on mount: a controlled page reports its reset, so a
// first run would throw away the page the app mounted the table on.
export const useResetPageOnChange = (
  { resetToFirstPage }: PageNavigation,
  { manualPagination }: PagingSettings,
  viewSnapshot: object,
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
