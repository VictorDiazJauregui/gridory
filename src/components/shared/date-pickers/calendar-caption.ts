import type { CalendarLabels } from "../../ui/calendar/calendar-labels";
import type { CalendarLocale } from "../../ui/calendar/calendar-locale";
import type { CalendarProps } from "../../ui/calendar/calendar";

/** Accessible names of the calendar button and the calendar, and its language (Spanish when unset). */
export interface CalendarTexts {
  ariaLabel: string;
  labels: CalendarLabels;
  locale?: CalendarLocale;
}

export interface CalendarYearRange {
  monthYearDropdown: boolean;
  fromYear: number;
  toYear: number;
}

type CalendarCaption = Pick<
  CalendarProps,
  "captionLayout" | "startMonth" | "endMonth"
>;

export const resolveCalendarCaption = ({
  monthYearDropdown,
  fromYear,
  toYear,
}: CalendarYearRange): CalendarCaption => ({
  captionLayout: monthYearDropdown ? "dropdown" : "label",
  startMonth: monthYearDropdown ? new Date(fromYear, 0, 1) : undefined,
  endMonth: monthYearDropdown ? new Date(toYear, 11, 31) : undefined,
});
