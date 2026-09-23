"use client";

import * as React from "react";
import {
  DayPicker,
  type DayButton,
  type Locale,
  type Modifiers,
} from "react-day-picker";
import { es } from "date-fns/locale";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

/**
 * Every react-day-picker element gets a `gdy-calendar-*` hook (no `rdp-*`
 * default is merged in). Day states are not classes: react-day-picker already
 * writes `data-today`, `data-selected`, `data-outside`, `data-disabled` and
 * `data-hidden` on the cell, and the `Day` / `DayButton` overrides below add
 * `data-range-start|middle|end` and `data-selected-single`.
 * Styles: src/components/ui/styles.css.
 */
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

const rangeAttributes = (modifiers: Modifiers) => ({
  "data-range-start": modifiers.range_start || undefined,
  "data-range-middle": modifiers.range_middle || undefined,
  "data-range-end": modifiers.range_end || undefined,
});

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const activeLocale = locale ?? es;

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={className}
      captionLayout={captionLayout}
      locale={activeLocale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(activeLocale.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{ ...CALENDAR_CLASS_NAMES, ...classNames }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div
            data-slot="calendar"
            ref={rootRef}
            className={className}
            {...props}
          />
        ),
        Day: ({ day, modifiers, ...tdProps }) => {
          void day; // only the modifiers are needed; `day` must not reach the DOM
          return <td {...tdProps} {...rangeAttributes(modifiers)} />;
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return <ChevronLeftIcon className={className} {...props} />;
          }
          if (orientation === "right") {
            return <ChevronRightIcon className={className} {...props} />;
          }
          return <ChevronDownIcon className={className} {...props} />;
        },
        DayButton: (props) => (
          <CalendarDayButton locale={activeLocale} {...props} />
        ),
        ...components,
      }}
      {...props}
    />
  );
}

type CalendarDayButtonProps = React.ComponentProps<typeof DayButton> & {
  locale?: Partial<Locale>;
};

/**
 * Own day button: the hook comes from `classNames.day_button`. Like the default
 * DayButton of react-day-picker, it takes the DOM focus when the picker marks
 * the day as focused (arrow keys, Home/End, PageUp/PageDown).
 */
function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: CalendarDayButtonProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      className={className}
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        (modifiers.selected &&
          !modifiers.range_start &&
          !modifiers.range_end &&
          !modifiers.range_middle) ||
        undefined
      }
      {...rangeAttributes(modifiers)}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
