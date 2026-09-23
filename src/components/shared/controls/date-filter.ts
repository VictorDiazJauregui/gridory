import type { DateFilterState, Primitive } from "../data-model";

export const EMPTY_DATE_FILTER_STATE: DateFilterState = {
  op: "",
  date: "",
  dateFrom: "",
  dateTo: "",
};

/** Reduces a raw date value to its `YYYY-MM-DD` prefix so dates compare as strings. */
export const toComparableDate = (value: Primitive | Primitive[]): string => {
  const dateRaw = Array.isArray(value) ? value[0] : value;
  if (!dateRaw) return "";
  return String(dateRaw).slice(0, 10);
};

export const hasDateFilterValue = (value?: DateFilterState) => {
  if (!value) return false;
  if (value.op === "gt" || value.op === "lt") return Boolean(value.date);
  return Boolean(value.dateFrom && value.dateTo);
};
