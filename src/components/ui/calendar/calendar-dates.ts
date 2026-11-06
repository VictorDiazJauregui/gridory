export const DAYS_PER_WEEK = 7;

export const startOfMonth = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), 1);

export const addMonths = (date: Date, months: number): Date =>
  new Date(date.getFullYear(), date.getMonth() + months, 1);

export const addDays = (date: Date, days: number): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

export const isSameDay = (left?: Date, right?: Date): boolean =>
  !!left && !!right && left.toDateString() === right.toDateString();

export const isSameMonth = (left: Date, right: Date): boolean =>
  left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth();

const padNumber = (value: number, length: number): string => String(value).padStart(length, "0");

export const toIsoDay = (date: Date): string =>
  `${padNumber(date.getFullYear(), 4)}-${padNumber(date.getMonth() + 1, 2)}-${padNumber(date.getDate(), 2)}`;

export const countDaysIntoWeek = (date: Date, weekStartsOn: number): number =>
  (date.getDay() - weekStartsOn + DAYS_PER_WEEK) % DAYS_PER_WEEK;

const countDaysInMonth = (month: Date): number => new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

// Only the weeks the month touches, as in 1.x: a fixed six rows would change the height of the popover.
export const buildMonthWeeks = (month: Date, weekStartsOn: number): Date[][] => {
  const leadingDays = countDaysIntoWeek(startOfMonth(month), weekStartsOn);
  const firstDay = addDays(startOfMonth(month), -leadingDays);
  const weekCount = Math.ceil((leadingDays + countDaysInMonth(month)) / DAYS_PER_WEEK);
  return Array.from({ length: weekCount }, (_, week) =>
    Array.from({ length: DAYS_PER_WEEK }, (_, day) => addDays(firstDay, week * DAYS_PER_WEEK + day)),
  );
};

// January 31 plus a month lands on February 28, not on March 3: the APG date picker stays in the target month.
export const addMonthsKeepingDay = (day: Date, months: number): Date => {
  const month = addMonths(day, months);
  return new Date(month.getFullYear(), month.getMonth(), Math.min(day.getDate(), countDaysInMonth(month)));
};

export const clampDate = (date: Date, earliest?: Date, latest?: Date): Date => {
  if (earliest && date < earliest) return earliest;
  if (latest && date > latest) return latest;
  return date;
};
