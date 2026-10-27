import { useEffect, useRef } from "react";
import { useLatestRef } from "../../shared/use-latest-ref";
import type { TableSettings } from "../settings";
import type { PageNavigation } from "./use-table-pagination";

interface PageSyncInput<TData> {
  /** The page asked for (the prop when controlled), before fitting it into the page count. */
  rawPageIndex: number;
  navigation: PageNavigation;
  settings: TableSettings<TData>;
}

// A controlled page beyond the last one is shown as the last page and the fix is reported, once.
// Never while loading: a transient row count (0 while the server answers) would send the app to page 1.
const useOutOfRangeReport = <TData>({ rawPageIndex, navigation, settings }: PageSyncInput<TData>) => {
  const { pageIndex, pageSize } = navigation;
  const isControlled = settings.pageIndex !== undefined;
  const onPaginationChangeRef = useLatestRef(settings.onPaginationChange);
  useEffect(() => {
    if (!isControlled || settings.loading || rawPageIndex === pageIndex) return;
    onPaginationChangeRef.current?.({ pageIndex, pageSize });
  }, [isControlled, settings.loading, rawPageIndex, pageIndex, pageSize, onPaginationChangeRef]);
};

// A page size set from outside starts again from the first page, as the page-size select does.
const useOutsidePageSizeReset = <TData>({ navigation, settings }: PageSyncInput<TData>) => {
  const { pageSize } = settings;
  const previousRef = useRef(pageSize);
  const resetRef = useLatestRef(navigation.resetToFirstPage);
  useEffect(() => {
    if (previousRef.current === pageSize) return;
    previousRef.current = pageSize;
    if (pageSize !== undefined) resetRef.current();
  }, [pageSize, resetRef]);
};

export const usePageSync = <TData>(input: PageSyncInput<TData>) => {
  useOutOfRangeReport(input);
  useOutsidePageSizeReset(input);
};
