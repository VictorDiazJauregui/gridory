import { useMemo } from "react";
import type { DateFilterState } from "../data-model";
import { hasDateFilterValue } from "./date-filter";

export const useActiveFilters = (
  filters: Record<string, string[]>,
  dateFilters: Record<string, DateFilterState>,
) => {
  return useMemo(() => {
    const hasMultiFilter = Object.values(filters).some(
      (value) => value.length > 0,
    );
    const hasDateFilter = Object.values(dateFilters).some((value) =>
      hasDateFilterValue(value),
    );
    return hasMultiFilter || hasDateFilter;
  }, [filters, dateFilters]);
};
