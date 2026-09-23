import { format, parse, isValid } from "date-fns";
import type { DateInputFormat } from "../data-model";

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
