import { useState, type Dispatch, type SetStateAction } from "react";
import type { TableSettings } from "./settings";

export interface PageWindow {
  pageIndex: number;
  pageSize: number;
}

interface PageNavigationInput extends PageWindow {
  pageCount: number;
  setPageIndex: Dispatch<SetStateAction<number>>;
  setPageSize: Dispatch<SetStateAction<number>>;
  onPaginationChange?: (state: PageWindow) => void;
}

const computePageCount = <TData>(
  localRowCount: number,
  pageSize: number,
  settings: TableSettings<TData>,
): number => {
  const { flags, manualPagination, serverPageCount, serverRowCount } = settings;
  if (!flags.pagination) return 1;
  if (!manualPagination) {
    return Math.max(1, Math.ceil(localRowCount / pageSize));
  }
  if (serverPageCount !== undefined) return Math.max(1, serverPageCount);
  const total = serverRowCount ?? localRowCount;
  return Math.max(1, Math.ceil(total / pageSize));
};

const buildPageNavigation = (input: PageNavigationInput) => {
  const { pageCount, pageSize, setPageIndex, setPageSize } = input;
  const changePageSize = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
    input.onPaginationChange?.({ pageIndex: 0, pageSize: size });
  };
  const goToPage = (next: number) => {
    const target = Math.min(Math.max(0, next), pageCount - 1);
    setPageIndex(target);
    input.onPaginationChange?.({ pageIndex: target, pageSize });
  };
  return { changePageSize, goToPage };
};

export interface PageNavigation extends PageWindow {
  pageCount: number;
  setPageIndex: Dispatch<SetStateAction<number>>;
  changePageSize: (size: number) => void;
  goToPage: (next: number) => void;
}

export const useTablePagination = <TData>(
  localRowCount: number,
  settings: TableSettings<TData>,
): PageNavigation => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(settings.defaultPageSize);
  const pageCount = computePageCount(localRowCount, pageSize, settings);
  const safePageIndex = Math.min(pageIndex, pageCount - 1);
  const navigation = buildPageNavigation({
    pageIndex: safePageIndex,
    pageSize,
    pageCount,
    setPageIndex,
    setPageSize,
    onPaginationChange: settings.onPaginationChange,
  });
  return { pageIndex: safePageIndex, pageSize, pageCount, setPageIndex, ...navigation };
};
