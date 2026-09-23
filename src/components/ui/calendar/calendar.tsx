"use client";

import * as React from "react";
import {
  DayPicker,
  type CustomComponents,
  type Locale,
} from "react-day-picker";
import { es } from "date-fns/locale";

import { CalendarChevron } from "./calendar-chevron";
import { CalendarDay } from "./calendar-day";
import { CalendarDayButton } from "./calendar-day-button";
import { CalendarRoot } from "./calendar-root";

const CALENDAR_CLASS_NAMES: React.ComponentProps<typeof DayPicker>["classNames"] = {
  root: "gdy-calendar-root",
  months: "gdy-calendar-months",
  month: "gdy-calendar-month",
  nav: "gdy-calendar-nav",
  button_previous: "gdy-calendar-button-previous",
  button_next: "gdy-calendar-button-next",
  month_caption: "gdy-calendar-month-caption",
  dropdowns: "gdy-calendar-dropdowns",
  dropdown_root: "gdy-calendar-dropdown-root",
  dropdown: "gdy-calendar-dropdown",
  months_dropdown: "gdy-calendar-months-dropdown",
  years_dropdown: "gdy-calendar-years-dropdown",
  caption_label: "gdy-calendar-caption-label",
  month_grid: "gdy-calendar-month-grid",
  weekdays: "gdy-calendar-weekdays",
  weekday: "gdy-calendar-weekday",
  weeks: "gdy-calendar-weeks",
  week: "gdy-calendar-week",
  week_number_header: "gdy-calendar-week-number-header",
  week_number: "gdy-calendar-week-number",
  day: "gdy-calendar-day",
  day_button: "gdy-calendar-day-button",
  chevron: "gdy-calendar-chevron",
  footer: "gdy-calendar-footer",
  // Day states travel as attributes, so the modifier class names stay empty.
  selected: "",
  today: "",
  outside: "",
  disabled: "",
  hidden: "",
  focused: "",
  range_start: "",
  range_middle: "",
  range_end: "",
};

type CalendarProps = React.ComponentProps<typeof DayPicker>;

// Module-level components keep their identity across renders: an inline
// component would remount the whole calendar subtree on every render.
const CALENDAR_COMPONENTS: Partial<CustomComponents> = {
  Root: CalendarRoot,
  Day: CalendarDay,
  Chevron: CalendarChevron,
};

const buildFormatters = (
  locale: Partial<Locale>,
  formatters: CalendarProps["formatters"],
): CalendarProps["formatters"] => ({
  formatMonthDropdown: (date) =>
    date.toLocaleString(locale.code, { month: "short" }),
  ...formatters,
});

// DayButton needs the active locale, so it stays a per-render closure.
const buildComponents = (
  locale: Partial<Locale>,
  components: CalendarProps["components"],
): CalendarProps["components"] => ({
  ...CALENDAR_COMPONENTS,
  DayButton: (props) => <CalendarDayButton locale={locale} {...props} />,
  ...components,
});

const Calendar = ({
  showOutsideDays = true,
  captionLayout = "label",
  locale,
  ...props
}: CalendarProps) => {
  const activeLocale = locale ?? es;
  return (
    <DayPicker
      {...props}
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      locale={activeLocale}
      formatters={buildFormatters(activeLocale, props.formatters)}
      classNames={{ ...CALENDAR_CLASS_NAMES, ...props.classNames }}
      components={buildComponents(activeLocale, props.components)}
    />
  );
}

export { Calendar };
