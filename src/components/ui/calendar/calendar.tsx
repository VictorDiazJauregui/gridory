"use client";

import { useMemo } from "react";

import { buildCalendarFormatters } from "./calendar-formatters";
import type { CalendarLabels } from "./calendar-labels";
import { resolveCalendarLocale, type CalendarLocale } from "./calendar-locale";
import { CalendarCaption } from "./calendar-caption";
import type { CalendarDayContext } from "./calendar-day";
import { CalendarMonthGrid } from "./calendar-month-grid";
import { CalendarNav } from "./calendar-nav";
import { addDayToRange, toggleDay, type CalendarSelection, type DateRange } from "./calendar-selection";
import { useCalendarKeyboard, useFocusedDay } from "./use-calendar-keyboard";
import { buildVisibleMonths, type VisibleMonths, type VisibleMonthsOptions } from "./visible-months";

export type { DateRange };

interface CalendarViewProps extends VisibleMonthsOptions {
  locale?: CalendarLocale;
  labels: CalendarLabels;
  captionLayout?: "label" | "dropdown";
}

type CalendarSelectionProps =
  | { mode: "single"; selected?: Date; onSelect?: (day: Date | undefined) => void }
  | { mode: "range"; selected?: DateRange; onSelect?: (range: DateRange | undefined) => void };

export type CalendarProps = CalendarViewProps & CalendarSelectionProps;

const selectDay = (props: CalendarSelectionProps, day: Date) => {
  if (props.mode === "single") return props.onSelect?.(toggleDay(props.selected, day));
  return props.onSelect?.(addDayToRange(props.selected, day));
};

const readSelection = (props: CalendarSelectionProps): CalendarSelection =>
  props.mode === "single" ? { mode: "single", selected: props.selected } : { mode: "range", selected: props.selected };

const readFirstSelectedDay = (selection: CalendarSelection): Date | undefined =>
  selection.mode === "single" ? selection.selected : selection.selected?.from;

const listYears = ({ startMonth, endMonth }: VisibleMonthsOptions): number[] | undefined => {
  if (!startMonth || !endMonth) return undefined;
  const firstYear = startMonth.getFullYear();
  return Array.from({ length: endMonth.getFullYear() - firstYear + 1 }, (_, index) => firstYear + index);
};

const useCalendarDays = (props: CalendarProps, visibleMonths: VisibleMonths, weekStartsOn: number) => {
  const selection = readSelection(props);
  const { monthsRef, onKeyDown, isTabbable, setCurrentDay } = useCalendarKeyboard({
    months: visibleMonths.months,
    preferredDays: [readFirstSelectedDay(selection), new Date()],
    weekStartsOn,
    revealDay: visibleMonths.revealDay,
  });
  const focus = useFocusedDay();
  const pressDay = (day: Date) => {
    setCurrentDay(day);
    selectDay(props, day);
  };
  const isHidden = visibleMonths.isOutsideYearRange;
  return { monthsRef, onKeyDown, days: { ...focus, selection, isTabbable, isHidden, pressDay } };
};

interface CalendarMonthsProps {
  props: CalendarProps;
  visibleMonths: VisibleMonths;
  context: CalendarDayContext & { weekStartsOn: number };
}

// Keyed by position, not by date, so the month and year selects keep the focus while they change the month.
const CalendarMonths = ({ props, visibleMonths, context }: CalendarMonthsProps) => {
  const years = props.captionLayout === "dropdown" ? listYears(props) : undefined;
  return visibleMonths.months.map((month, position) => (
    <div key={position} className="gdy-calendar-month">
      <CalendarCaption month={month} formatters={context.formatters} labels={props.labels} years={years}
        showMonth={visibleMonths.showMonth} />
      <CalendarMonthGrid month={month} weekStartsOn={context.weekStartsOn} context={context} />
    </div>
  ));
};

export const Calendar = (props: CalendarProps) => {
  const locale = resolveCalendarLocale(props.locale);
  const formatters = useMemo(() => buildCalendarFormatters(locale.code), [locale.code]);
  const visibleMonths = buildVisibleMonths(props);
  const { monthsRef, onKeyDown, days } = useCalendarDays(props, visibleMonths, locale.weekStartsOn);
  const context = { ...locale, ...days, formatters, labels: props.labels };
  return (
    <div data-slot="calendar" className="gdy-calendar-root" lang={locale.code} data-mode={props.mode}
      data-multiple-months={visibleMonths.months.length > 1 || undefined}>
      <div className="gdy-calendar-months" ref={monthsRef} onKeyDown={onKeyDown}>
        <CalendarNav labels={props.labels} canStepMonths={visibleMonths.canStepMonths} stepMonths={visibleMonths.stepMonths} />
        <CalendarMonths props={props} visibleMonths={visibleMonths} context={context} />
      </div>
    </div>
  );
};
