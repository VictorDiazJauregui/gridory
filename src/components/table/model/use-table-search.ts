import { useEffect, useRef, type RefObject } from "react";
import { useControllableState } from "../../shared/state/use-controllable-state";
import type { PageNavigation } from "../pagination/use-table-pagination";
import type { TableSettings } from "../settings";
import { useDebouncedCall } from "./use-debounced-call";

// With manualPagination the app reloads on `onSearchChange`, so the first page goes with the search
// report: delayed with it when there is a debounce, so both reach the app together.
const useSearchReport = <TData>(settings: TableSettings<TData>, pagingRef: RefObject<PageNavigation | null>) => {
  const lastReportedRef = useRef<string | undefined>(undefined);
  const report = (value: string) => {
    lastReportedRef.current = value;
    settings.onSearchChange?.(value);
    if (settings.manualPagination) pagingRef.current?.resetToFirstPage();
  };
  return { report, lastReportedRef };
};

interface OutsideSearchInput {
  outside: string | undefined;
  lastReportedRef: RefObject<string | undefined>;
  adopt: (value: string) => void;
}

// With a debounce the box keeps what the user types; a `search` the app sets takes its place, unless
// it is the echo of the value just reported (the user may have typed more since).
const useOutsideSearchAdoption = ({ outside, lastReportedRef, adopt }: OutsideSearchInput) => {
  const previousRef = useRef(outside);
  useEffect(() => {
    if (previousRef.current === outside) return;
    previousRef.current = outside;
    if (outside === undefined || outside === lastReportedRef.current) return;
    adopt(outside);
  });
};

const useSearchValue = <TData>(settings: TableSettings<TData>, isDebounced: boolean) =>
  useControllableState({
    value: isDebounced ? undefined : settings.search,
    defaultValue: settings.search ?? "",
    name: "search",
  });

export const useTableSearch = <TData>(settings: TableSettings<TData>, pagingRef: RefObject<PageNavigation | null>) => {
  const delayMs = settings.searchDebounceMs ?? 0;
  const [search, setSearch] = useSearchValue(settings, delayMs > 0);
  const { report, lastReportedRef } = useSearchReport(settings, pagingRef);
  const debounced = useDebouncedCall(report, delayMs);
  const adopt = (value: string) => {
    debounced.cancel();
    setSearch(value);
  };
  useOutsideSearchAdoption({ outside: delayMs > 0 ? settings.search : undefined, lastReportedRef, adopt });
  const changeSearch = (value: string) => {
    setSearch(value);
    if (delayMs > 0) debounced.schedule(value);
    else report(value);
  };
  return { search, changeSearch };
};
