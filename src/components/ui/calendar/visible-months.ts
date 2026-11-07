import { addMonths, clampDate, isSameMonth, startOfMonth } from "./calendar-dates";

export interface VisibleMonthsOptions {
  month?: Date;
  onMonthChange?: (month: Date) => void;
  numberOfMonths?: number;
  startMonth?: Date;
  endMonth?: Date;
}

export interface VisibleMonths {
  months: Date[];
  showMonth: (month: Date) => void;
  canStepMonths: (step: number) => boolean;
  stepMonths: (step: number) => void;
  /** Returns the day kept inside the year range, after showing its month. */
  revealDay: (day: Date) => Date;
  isOutsideYearRange: (day: Date) => boolean;
}

const listMonths = (firstMonth: Date, count: number): Date[] =>
  Array.from({ length: count }, (_, index) => addMonths(firstMonth, index));

// The last month of the range must still show in the last column, so the first one stops that many months earlier.
const buildFirstMonthClamp = ({ startMonth, endMonth, numberOfMonths = 1 }: VisibleMonthsOptions) => {
  const earliest = startMonth && startOfMonth(startMonth);
  const latest = endMonth && addMonths(endMonth, 1 - numberOfMonths);
  return (month: Date) => clampDate(startOfMonth(month), earliest, latest);
};

const buildDayClamp = ({ startMonth, endMonth }: VisibleMonthsOptions) => {
  const lastDay = endMonth && new Date(endMonth.getFullYear(), endMonth.getMonth() + 1, 0);
  return (day: Date) => clampDate(day, startMonth && startOfMonth(startMonth), lastDay);
};

export const buildVisibleMonths = (options: VisibleMonthsOptions): VisibleMonths => {
  const clampFirstMonth = buildFirstMonthClamp(options);
  const clampDay = buildDayClamp(options);
  const firstMonth = clampFirstMonth(options.month ?? new Date());
  const months = listMonths(firstMonth, options.numberOfMonths ?? 1);
  const showMonth = (month: Date) => options.onMonthChange?.(clampFirstMonth(month));
  const revealDay = (day: Date) => {
    const target = clampDay(day);
    if (months.some((month) => isSameMonth(month, target))) return target;
    showMonth(target < firstMonth ? target : addMonths(target, 1 - months.length));
    return target;
  };
  const canStepMonths = (step: number) => clampFirstMonth(addMonths(firstMonth, step)).getTime() !== firstMonth.getTime();
  const stepMonths = (step: number) => showMonth(addMonths(firstMonth, step));
  const isOutsideYearRange = (day: Date) => clampDay(day).getTime() !== day.getTime();
  return { months, showMonth, canStepMonths, stepMonths, revealDay, isOutsideYearRange };
};
