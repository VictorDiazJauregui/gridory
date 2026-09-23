import { format, parse, isValid } from "date-fns";
import type { DateFilterState, DateInputFormat, Primitive } from "./data-model";

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

/** Maps the user-facing mask (mm = month) to a date-fns pattern (MM = month). */
const dateFnsPattern = (mask: DateInputFormat): string =>
  mask.replace("mm", "MM");

export const parseInputToDate = (
  text: string,
  mask: DateInputFormat,
): Date | undefined => {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  const parsed = parse(trimmed, dateFnsPattern(mask), new Date());
  if (!isValid(parsed)) return undefined;
  return parsed;
};

export const formatDateToInput = (
  date: Date | undefined,
  mask: DateInputFormat,
): string => {
  if (!date) return "";
  return format(date, dateFnsPattern(mask));
};

export const parseStringToDate = (dateStr: string): Date | undefined => {
  if (!dateStr) return undefined;
  const [year, month, day] = dateStr.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  const date = new Date(year, month - 1, day);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

export const formatDateToString = (date: Date | undefined): string => {
  if (!date) return "";
  return format(date, "yyyy-MM-dd");
};
