import { useState } from "react";
import type { DateFilterState } from "../data-model";
import { useActiveFilters } from "./use-active-filters";
import { useFilterMenuAnchor } from "./use-filter-menu-anchor";

export const useColumnFilters = () => {
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [dateFilters, setDateFilters] = useState<
    Record<string, DateFilterState>
  >({});
  const menu = useFilterMenuAnchor();
  const hasActiveFilters = useActiveFilters(filters, dateFilters);
  const setFilter = (id: string, next: string[]) =>
    setFilters((previous) => ({ ...previous, [id]: next }));
  const setDateFilter = (id: string, next: DateFilterState) =>
    setDateFilters((previous) => ({ ...previous, [id]: next }));
  const clearFilters = () => {
    setFilters({});
    setDateFilters({});
  };
  return { ...menu, filters, dateFilters, hasActiveFilters, setFilter, setDateFilter, clearFilters };
};
