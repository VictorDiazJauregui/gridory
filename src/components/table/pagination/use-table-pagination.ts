import { useControllableState } from "../../shared/state/use-controllable-state";
import type { ManualPaginationState } from "../types";
import { usePageSync } from "./use-page-sync";

/** What the page window reads from the settings: the table passes its own, the card grid a client-side subset. */
export interface PagingSettings {
  pageIndex?: number;
  pageSize?: number;
  defaultPageSize: number;
  manualPagination?: boolean;
  serverPageCount?: number;
  serverRowCount?: number;
  onPaginationChange?: (state: ManualPaginationState) => void;
  loading?: boolean;
  flags: { pagination: boolean };
}

export interface PageWindow {
  pageIndex: number;
  pageSize: number;
}

const computePageCount = (localRowCount: number, pageSize: number, settings: PagingSettings): number => {
  const { flags, manualPagination, serverPageCount, serverRowCount } = settings;
  if (!flags.pagination) return 1;
  if (!manualPagination) {
    return Math.max(1, Math.ceil(localRowCount / pageSize));
  }
  if (serverPageCount !== undefined) return Math.max(1, serverPageCount);
  const total = serverRowCount ?? localRowCount;
  return Math.max(1, Math.ceil(total / pageSize));
};

export interface PageNavigation extends PageWindow {
  pageCount: number;
  /** A change the user asked for (previous or next page): always reported. */
  goToPage: (next: number) => void;
  /** The page-size select: back to the first page, always reported. */
  changePageSize: (size: number) => void;
  /**
   * A first page the table decides on its own (search, filters, sort, grouping, archived view).
   * Silent, as before, unless `pageIndex` is controlled: then it is reported or the app never sees it.
   */
  resetToFirstPage: () => void;
  /** Server-side sort or filter change: back to the first page, reported when the page changes. */
  returnToFirstPage: () => void;
}

const usePageWindowState = (settings: PagingSettings) => {
  const [rawPageIndex, setPageIndex] = useControllableState({
    value: settings.pageIndex,
    defaultValue: 0,
    name: "pageIndex",
  });
  const [pageSize, setPageSize] = useControllableState({
    value: settings.pageSize,
    defaultValue: settings.defaultPageSize,
    name: "pageSize",
  });
  return { rawPageIndex, pageSize, setPageIndex, setPageSize };
};

type PageWindowState = ReturnType<typeof usePageWindowState>;

interface NavigationInput extends PageWindow {
  pageCount: number;
  state: PageWindowState;
  settings: PagingSettings;
}

const buildUserNavigation = ({ pageIndex, pageSize, pageCount, state, settings }: NavigationInput) => ({
  goToPage: (next: number) => {
    const target = Math.min(Math.max(0, next), pageCount - 1);
    state.setPageIndex(target);
    settings.onPaginationChange?.({ pageIndex: target, pageSize });
  },
  changePageSize: (size: number) => {
    state.setPageSize(size);
    state.setPageIndex(0);
    settings.onPaginationChange?.({ pageIndex: 0, pageSize: size });
  },
  returnToFirstPage: () => {
    if (pageIndex === 0) return;
    state.setPageIndex(0);
    settings.onPaginationChange?.({ pageIndex: 0, pageSize });
  },
});

const buildFirstPageReset = ({ pageIndex, pageSize, state, settings }: NavigationInput) => () => {
  if (settings.pageIndex === undefined) {
    state.setPageIndex(0);
    return;
  }
  if (pageIndex !== 0) settings.onPaginationChange?.({ pageIndex: 0, pageSize });
};

export const useTablePagination = (localRowCount: number, settings: PagingSettings): PageNavigation => {
  const state = usePageWindowState(settings);
  const { rawPageIndex, pageSize } = state;
  const pageCount = computePageCount(localRowCount, pageSize, settings);
  const pageIndex = Math.max(0, Math.min(rawPageIndex, pageCount - 1));
  const input = { pageIndex, pageSize, pageCount, state, settings };
  const navigation = { pageIndex, pageSize, pageCount, ...buildUserNavigation(input), resetToFirstPage: buildFirstPageReset(input) };
  usePageSync({ rawPageIndex, navigation, settings });
  return navigation;
};
