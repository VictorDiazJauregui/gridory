import { useEffect, type Dispatch, type SetStateAction } from "react";
import type { ViewSnapshot } from "./use-view-snapshot";

export const useResetPageOnChange = (
  setPageIndex: Dispatch<SetStateAction<number>>,
  manualPagination: boolean,
  viewSnapshot: ViewSnapshot,
) => {
  useEffect(() => {
    if (manualPagination) return;
    setPageIndex(0);
  }, [manualPagination, setPageIndex, viewSnapshot]);
};
