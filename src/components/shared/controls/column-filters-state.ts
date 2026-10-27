import type { ColumnFiltersState, DateFilterState } from "../data-model";
import { hasDateFilterValue } from "./date-filter";

export const EMPTY_COLUMN_FILTERS: ColumnFiltersState = { values: {}, dates: {} };

const keepEntries = <TValue>(record: Record<string, TValue>, isActive: (value: TValue) => boolean) =>
  Object.fromEntries(Object.entries(record).filter(([, value]) => isActive(value)));

/** Drops the columns without a selected value and the date filters still incomplete. */
export const toActiveColumnFilters = (state: ColumnFiltersState): ColumnFiltersState => ({
  values: keepEntries(state.values, (selected) => selected.length > 0),
  dates: keepEntries(state.dates, hasDateFilterValue),
});

const areSameValues = (left: string[], right: string[] | undefined) =>
  right !== undefined && left.length === right.length && left.every((value, index) => value === right[index]);

const areSameDates = (left: DateFilterState, right: DateFilterState | undefined) =>
  right !== undefined &&
  left.op === right.op &&
  left.date === right.date &&
  left.dateFrom === right.dateFrom &&
  left.dateTo === right.dateTo;

const areSameRecords = <TValue>(
  left: Record<string, TValue>,
  right: Record<string, TValue>,
  isSame: (first: TValue, second: TValue | undefined) => boolean,
) => {
  const keys = Object.keys(left);
  if (keys.length !== Object.keys(right).length) return false;
  return keys.every((key) => isSame(left[key], right[key]));
};

/** Compares two filter states by content, so a new object with the same filters is no change. */
export const areColumnFiltersEqual = (left: ColumnFiltersState, right: ColumnFiltersState) =>
  areSameRecords(left.values, right.values, areSameValues) &&
  areSameRecords(left.dates, right.dates, areSameDates);
