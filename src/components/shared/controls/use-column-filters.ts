import { useEffect, useRef } from "react";
import type { ColumnFiltersState, DateFilterState } from "../data-model";
import { useControllableState } from "../state/use-controllable-state";
import { areColumnFiltersEqual, EMPTY_COLUMN_FILTERS, toActiveColumnFilters } from "./column-filters-state";
import { useActiveFilters } from "./use-active-filters";
import { useFilterMenuAnchor } from "./use-filter-menu-anchor";

export interface ColumnFiltersControl {
  /** Controlled filters; `undefined` keeps them internal. */
  value?: ColumnFiltersState;
  /** Receives only the active filters, and only when they change. */
  onChange?: (filters: ColumnFiltersState) => void;
}

// The menus keep an incomplete date filter (an operator without a date) so it reopens as it was,
// but the consumer only hears about the filters that actually filter, and only when they change.
const useReportedFilterState = (control: ColumnFiltersControl) => {
  const renderedRef = useRef(EMPTY_COLUMN_FILTERS);
  const reportActiveChange = (next: ColumnFiltersState) => {
    const active = toActiveColumnFilters(next);
    if (areColumnFiltersEqual(active, toActiveColumnFilters(renderedRef.current))) return;
    control.onChange?.(active);
  };
  const [state, setState] = useControllableState<ColumnFiltersState>({
    value: control.value,
    defaultValue: EMPTY_COLUMN_FILTERS,
    onChange: reportActiveChange,
    name: "columnFilters",
  });
  useEffect(() => {
    renderedRef.current = state;
  });
  return [state, setState] as const;
};

export const useColumnFilters = (control: ColumnFiltersControl = {}) => {
  const [state, setState] = useReportedFilterState(control);
  const { values: filters, dates: dateFilters } = state;
  const menu = useFilterMenuAnchor();
  const hasActiveFilters = useActiveFilters(filters, dateFilters);
  const setFilter = (id: string, next: string[]) =>
    setState((previous) => ({ ...previous, values: { ...previous.values, [id]: next } }));
  const setDateFilter = (id: string, next: DateFilterState) =>
    setState((previous) => ({ ...previous, dates: { ...previous.dates, [id]: next } }));
  const clearFilters = () => setState(EMPTY_COLUMN_FILTERS);
  return { ...menu, filters, dateFilters, hasActiveFilters, setFilter, setDateFilter, clearFilters };
};
