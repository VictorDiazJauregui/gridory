import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { addDays, addMonthsKeepingDay, countDaysIntoWeek, DAYS_PER_WEEK, isSameDay, isSameMonth } from "./calendar-dates";

const MONTHS_PER_YEAR = 12;
const DAY_STEPS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -DAYS_PER_WEEK, ArrowDown: DAYS_PER_WEEK };
const PAGE_DIRECTIONS: Record<string, number> = { PageUp: -1, PageDown: 1 };

// The keys of the APG date picker dialog; Shift turns PageUp and PageDown into a year.
const findNextDay = (event: KeyboardEvent, day: Date, weekStartsOn: number): Date | undefined => {
  if (event.key in DAY_STEPS) return addDays(day, DAY_STEPS[event.key]);
  if (event.key in PAGE_DIRECTIONS) {
    return addMonthsKeepingDay(day, PAGE_DIRECTIONS[event.key] * (event.shiftKey ? MONTHS_PER_YEAR : 1));
  }
  const daysIntoWeek = countDaysIntoWeek(day, weekStartsOn);
  if (event.key === "Home") return addDays(day, -daysIntoWeek);
  if (event.key === "End") return addDays(day, DAYS_PER_WEEK - 1 - daysIntoWeek);
  return undefined;
};

export interface CalendarKeyboardOptions {
  months: Date[];
  /** Tried in order when no day has been focused yet: the selection, then today. */
  preferredDays: (Date | undefined)[];
  weekStartsOn: number;
  revealDay: (day: Date) => Date;
}

// Roving tabindex: a single day of the visible months is tabbable, and the first month's first day stands in when no
// candidate is visible.
const findTabbableDay = (months: Date[], candidates: (Date | undefined)[]): Date =>
  candidates.find((day) => day && months.some((month) => isSameMonth(month, day))) ?? months[0];

// The day a key lands on may only exist after the month changes, so it takes the focus once rendered.
const useFocusAfterKeyMove = (currentDay: Date | undefined) => {
  const movedByKeyRef = useRef(false);
  const monthsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!movedByKeyRef.current) return;
    movedByKeyRef.current = false;
    monthsRef.current?.querySelector<HTMLButtonElement>('.gdy-calendar-day-button[tabindex="0"]')?.focus();
  }, [currentDay]);
  return { monthsRef, movedByKeyRef };
};

export const useCalendarKeyboard = ({ months, preferredDays, weekStartsOn, revealDay }: CalendarKeyboardOptions) => {
  const [currentDay, setCurrentDay] = useState<Date>();
  const { monthsRef, movedByKeyRef } = useFocusAfterKeyMove(currentDay);
  const tabbableDay = findTabbableDay(months, [currentDay, ...preferredDays]);
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!(event.target as HTMLElement).classList.contains("gdy-calendar-day-button")) return;
    const nextDay = findNextDay(event, tabbableDay, weekStartsOn);
    if (!nextDay) return;
    event.preventDefault();
    movedByKeyRef.current = true;
    setCurrentDay(revealDay(nextDay));
  };
  const isTabbable = (day: Date, month: Date) => isSameDay(day, tabbableDay) && isSameMonth(day, month);
  return { monthsRef, onKeyDown, isTabbable, setCurrentDay };
};

interface FocusedDay {
  day: Date;
  month: Date;
}

// data-focused marks the cell whose button holds the DOM focus, in the grid it was focused in, as the 1.x calendar did.
export const useFocusedDay = () => {
  const [focused, setFocused] = useState<FocusedDay>();
  const focusDay = (day: Date, month: Date) => setFocused({ day, month });
  const blurDay = () => setFocused(undefined);
  const isFocused = (day: Date, month: Date) =>
    !!focused && isSameDay(focused.day, day) && isSameMonth(focused.month, month);
  return { focusDay, blurDay, isFocused };
};
