import { useEffect, useRef } from "react";
import { useLatestRef } from "../../shared/use-latest-ref";
import type { TableSettings } from "../settings";
import type { VisibleRowsState } from "../types";
import { buildVisibleRowsState, isSameVisibleRows } from "./visible-rows";

interface VisibleRowsSources<TData> {
  pageRows: TData[];
  filteredRows: TData[];
}

// Compares against the last emitted state instead of trusting memo identities: inline
// `columns` or a re-run effect (StrictMode) recompute the arrays without changing a row.
export const useVisibleRowsChange = <TData>(
  { pageRows, filteredRows }: VisibleRowsSources<TData>,
  settings: TableSettings<TData>,
) => {
  const { manualPagination, serverRowCount, onVisibleRowsChange } = settings;
  const callbackRef = useLatestRef(onVisibleRowsChange);
  const lastEmittedRef = useRef<VisibleRowsState<TData>>(undefined);
  useEffect(() => {
    if (!callbackRef.current) return;
    const next = buildVisibleRowsState({ pageRows, filteredRows, manualPagination, serverRowCount });
    if (isSameVisibleRows(lastEmittedRef.current, next)) return;
    lastEmittedRef.current = next;
    callbackRef.current(next);
  }, [pageRows, filteredRows, manualPagination, serverRowCount, callbackRef]);
};
