import type { DateInputFormat } from "../data-model";

interface CalendarDate {
  day: number;
  month: number;
  year: number;
}

const MASK_FIELD_PATTERNS: Record<string, string> = {
  dd: "(?<day>\\d{1,2})",
  mm: "(?<month>\\d{1,2})",
  yyyy: "(?<year>\\d{1,4})",
};

// Reading and writing the four fixed masks by hand spares the package a date library and its token parsers.
const buildMaskPattern = (mask: DateInputFormat): RegExp =>
  new RegExp(`^${mask.replace(/dd|mm|yyyy/g, (field) => MASK_FIELD_PATTERNS[field])}$`);

const readCalendarDate = (text: string, mask: DateInputFormat): CalendarDate | undefined => {
  const fields = buildMaskPattern(mask).exec(text)?.groups;
  if (!fields) return undefined;
  return { day: Number(fields.day), month: Number(fields.month), year: Number(fields.year) };
};

// Year 0 is rejected because date-fns' parse rejected it. setFullYear, unlike the Date constructor, keeps years
// 1 to 99 out of the 1900s.
const toExistingLocalDate = ({ day, month, year }: CalendarDate): Date | undefined => {
  if (year < 1) return undefined;
  const date = new Date(2000, 0, 1);
  date.setFullYear(year, month - 1, day);
  const matchesTypedDayAndMonth = date.getMonth() === month - 1 && date.getDate() === day;
  return matchesTypedDayAndMonth ? date : undefined;
};

const padNumber = (value: number, length: number): string => String(value).padStart(length, "0");

const writeMaskedDate = (date: Date, mask: DateInputFormat | "yyyy-mm-dd"): string =>
  mask
    .replace("dd", padNumber(date.getDate(), 2))
    .replace("mm", padNumber(date.getMonth() + 1, 2))
    .replace("yyyy", padNumber(date.getFullYear(), 4));

export const parseInputToDate = (
  text: string,
  mask: DateInputFormat,
): Date | undefined => {
  const calendarDate = readCalendarDate(text.trim(), mask);
  return calendarDate && toExistingLocalDate(calendarDate);
};

export const formatDateToInput = (
  date: Date | undefined,
  mask: DateInputFormat,
): string => {
  if (!date) return "";
  return writeMaskedDate(date, mask);
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
  return writeMaskedDate(date, "yyyy-mm-dd");
};
