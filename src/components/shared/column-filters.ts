import type { DateFilterState, DateInputFormat } from "./data-model";
import { EMPTY_DATE_FILTER_STATE, hasDateFilterValue } from "./date-filter";

export interface CalendarSettings {
  dateInputFormat: DateInputFormat;
  calendarMonthYearDropdown: boolean;
  calendarFromYear: number;
  calendarToYear: number;
}

export const hasColumnFilter = (
  columnId: string,
  filters: Record<string, string[]>,
  dateFilters: Record<string, DateFilterState>,
) =>
  (filters[columnId]?.length ?? 0) > 0 ||
  hasDateFilterValue(dateFilters[columnId]);

export const resolveEmptyDateState = (requireOperator: boolean) =>
  requireOperator
    ? EMPTY_DATE_FILTER_STATE
    : { ...EMPTY_DATE_FILTER_STATE, op: "gt" as const };

export const buildDateFilterMenuKey = (
  columnId: string,
  state?: DateFilterState,
) =>
  `${columnId}-${state?.op ?? "gt"}-${state?.date ?? ""}-${state?.dateFrom ?? ""}-${state?.dateTo ?? ""}`;

export const pickCalendarSettings = ({
  dateInputFormat,
  calendarMonthYearDropdown,
  calendarFromYear,
  calendarToYear,
}: CalendarSettings): CalendarSettings => ({
  dateInputFormat,
  calendarMonthYearDropdown,
  calendarFromYear,
  calendarToYear,
});
