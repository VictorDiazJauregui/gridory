import { useEffect, useMemo, type RefObject } from "react";
import type { DateFilterState } from "./data-model";
import { hasDateFilterValue } from "./date-utils";

/**
 * Calls `onOutside` on any mousedown outside `ref`. Clicks inside the portaled
 * primitives (popover, calendar, Radix popper) count as inside so a filter
 * panel stays open while its date picker is in use.
 */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
) => {
  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (!ref.current) return;
      if (ref.current.contains(event.target as Node)) return;

      const target = event.target as HTMLElement;
      if (target.closest('[data-slot="popover-content"]')) return;
      if (target.closest('[data-slot="calendar"]')) return;
      if (target.closest("[data-radix-popper-content-wrapper]")) return;

      onOutside();
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [ref, onOutside]);
};

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
