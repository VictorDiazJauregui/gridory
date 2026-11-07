import { isSameDay } from "./calendar-dates";

export interface DateRange {
  from?: Date;
  to?: Date;
}

export type CalendarSelection = { mode: "single"; selected?: Date } | { mode: "range"; selected?: DateRange };

export interface DaySelectionMarks {
  selected: boolean;
  single: boolean;
  rangeStart: boolean;
  rangeMiddle: boolean;
  rangeEnd: boolean;
}

const NO_RANGE_MARKS = { rangeStart: false, rangeMiddle: false, rangeEnd: false };

const markSelectedDay = (selected: Date | undefined, day: Date): DaySelectionMarks => {
  const isSelected = isSameDay(selected, day);
  return { selected: isSelected, single: isSelected, ...NO_RANGE_MARKS };
};

// A range with one end still marks that day as a single selection, as the 1.x calendar did.
const markRangeDay = (range: DateRange | undefined, day: Date): DaySelectionMarks => {
  const { from, to } = range ?? {};
  if (!from || !to) return markSelectedDay(from ?? to, day);
  const rangeStart = isSameDay(day, from);
  const rangeEnd = isSameDay(day, to);
  const rangeMiddle = !rangeStart && !rangeEnd && day > from && day < to;
  return { selected: rangeStart || rangeMiddle || rangeEnd, single: false, rangeStart, rangeMiddle, rangeEnd };
};

export const markDay = (selection: CalendarSelection, day: Date): DaySelectionMarks =>
  selection.mode === "single" ? markSelectedDay(selection.selected, day) : markRangeDay(selection.selected, day);

// As in 1.x, pressing the selected day clears it.
export const toggleDay = (selected: Date | undefined, day: Date): Date | undefined =>
  isSameDay(selected, day) ? undefined : day;

const extendClosedRange = (from: Date, to: Date, day: Date): DateRange | undefined => {
  if (isSameDay(from, day) && isSameDay(to, day)) return undefined;
  if (isSameDay(from, day)) return { from, to: day };
  if (isSameDay(to, day)) return { from: day, to: day };
  return day < from ? { from: day, to } : { from, to: day };
};

// The rules of react-day-picker's addToRange, which the 1.x calendar used: the first press selects one day, the next
// closes the range on either side, and on a closed range a press before the start moves the start, any other the end.
export const addDayToRange = (range: DateRange | undefined, day: Date): DateRange | undefined => {
  const { from, to } = range ?? {};
  if (from && to) return extendClosedRange(from, to, day);
  if (!from) return { from: day, to: day };
  return day < from ? { from: day, to: from } : { from, to: day };
};
