import type { Locale } from "date-fns";
import type { DayPickerProps } from "react-day-picker";

/** Accessible name of the calendar button and language of the calendar (Spanish when unset). */
export interface CalendarTexts {
  ariaLabel: string;
  locale?: Locale;
}

export interface CalendarYearRange {
  monthYearDropdown: boolean;
  fromYear: number;
  toYear: number;
}

type CalendarCaption = Pick<
  DayPickerProps,
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
