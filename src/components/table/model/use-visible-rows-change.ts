import { useEffect, useRef } from "react";
import { useLatestRef } from "../../shared/use-latest-ref";
import type { TableSettings } from "../settings";
import type { VisibleRowsState } from "../types";
import { buildVisibleRowsState, isSameVisibleRows } from "./visible-rows";

/** What the report reads from the settings: the table passes its own, the card grid a client-side subset. */
type VisibleRowsSettings<TData> = Pick<TableSettings<TData>, "onVisibleRowsChange" | "loading" | "serverRowCount"> & {
  manualPagination?: boolean;
};

interface VisibleRowsSources<TData> {
  /** `null` while the rows on screen are not the page (printing every row): nothing is reported. */
  pageRows: TData[] | null;
  filteredRows: TData[];
}

// Compares against the last emitted state instead of trusting memo identities: inline
// `columns` or a re-run effect (StrictMode) recompute the arrays without changing a row.
export const useVisibleRowsChange = <TData>(
  { pageRows, filteredRows }: VisibleRowsSources<TData>,
  settings: VisibleRowsSettings<TData>,
) => {
  const { manualPagination, serverRowCount, onVisibleRowsChange, loading } = settings;
  const callbackRef = useLatestRef(onVisibleRowsChange);
  const lastEmittedRef = useRef<VisibleRowsState<TData>>(undefined);
  useEffect(() => {
    if (!callbackRef.current || loading || !pageRows) return;
    const next = buildVisibleRowsState({ pageRows, filteredRows, manualPagination, serverRowCount });
    if (isSameVisibleRows(lastEmittedRef.current, next)) return;
    lastEmittedRef.current = next;
    callbackRef.current(next);
  }, [pageRows, filteredRows, manualPagination, serverRowCount, loading, callbackRef]);
};
