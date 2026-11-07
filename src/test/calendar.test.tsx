import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { expect, test } from "vitest";
import { DATA_VIEW_LABELS } from "../components/shared/labels/data-view-labels";
import { Calendar, type DateRange } from "../components/ui/calendar/calendar";
import type { CalendarLocale } from "../components/ui/calendar/calendar-locale";

const YEAR_RANGE = { captionLayout: "dropdown" as const, startMonth: new Date(2016, 0, 1), endMonth: new Date(2036, 11, 31) };

interface HarnessProps {
  initialMonth: Date;
  locale?: CalendarLocale;
  endMonth?: Date;
}

const SingleCalendar = ({ initialMonth, locale }: HarnessProps) => {
  const [month, setMonth] = useState(initialMonth);
  const [selected, setSelected] = useState<Date | undefined>(new Date(2026, 10, 7));
  return (
    <Calendar mode="single" labels={DATA_VIEW_LABELS} locale={locale} month={month} onMonthChange={setMonth}
      selected={selected} onSelect={setSelected} {...YEAR_RANGE} />
  );
};

const RangeCalendar = ({ initialMonth, endMonth = YEAR_RANGE.endMonth }: HarnessProps) => {
  const [month, setMonth] = useState(initialMonth);
  const [selected, setSelected] = useState<DateRange>();
  return (
    <Calendar mode="range" numberOfMonths={2} labels={DATA_VIEW_LABELS} month={month} onMonthChange={setMonth}
      selected={selected} onSelect={setSelected} {...YEAR_RANGE} endMonth={endMonth} />
  );
};

const NOVEMBER_2026 = new Date(2026, 10, 1);

const dayCell = (isoDay: string) => document.querySelector(`.gdy-calendar-day[data-day="${isoDay}"]:not([data-outside])`) as HTMLElement;
const dayButton = (isoDay: string) => dayCell(isoDay).querySelector("button") as HTMLButtonElement;
const tabbableDays = () => [...document.querySelectorAll<HTMLElement>('.gdy-calendar-day-button[tabindex="0"]')];
const pressKey = (key: string, shiftKey = false) => fireEvent.keyDown(document.activeElement as Element, { key, shiftKey });
const focusedIsoDay = () => (document.activeElement?.closest(".gdy-calendar-day") as HTMLElement).dataset.day;
const shownMonths = () => screen.getAllByRole("grid").map((grid) => grid.getAttribute("aria-label"));

test("the selected day is the only tabbable day", () => {
  render(<SingleCalendar initialMonth={NOVEMBER_2026} />);
  expect(tabbableDays()).toEqual([dayButton("2026-11-07")]);
});

test("arrows, PageUp/PageDown, Shift and Home/End move the focus like the APG date picker", () => {
  render(<SingleCalendar initialMonth={NOVEMBER_2026} />);
  dayButton("2026-11-07").focus();
  const route = [["ArrowRight"], ["ArrowDown"], ["PageDown"], ["Home"], ["End"], ["PageUp", true], ["ArrowUp"]] as const;
  const landed = route.map(([key, shiftKey]) => {
    pressKey(key, shiftKey);
    return focusedIsoDay();
  });
  expect(landed).toEqual(["2026-11-08", "2026-11-15", "2026-12-15", "2026-12-14", "2026-12-20", "2025-12-20", "2025-12-13"]);
  expect(shownMonths()).toEqual(["diciembre 2025"]);
});

test("PageDown keeps the last day of a shorter month", () => {
  render(<SingleCalendar initialMonth={new Date(2027, 0, 1)} />);
  fireEvent.click(dayButton("2027-01-31"));
  dayButton("2027-01-31").focus();
  pressKey("PageDown");
  expect(focusedIsoDay()).toBe("2027-02-28");
});

test("the week of Home and End follows the locale", () => {
  render(<SingleCalendar initialMonth={NOVEMBER_2026} locale={{ code: "en-US", options: { weekStartsOn: 0 } }} />);
  dayButton("2026-11-07").focus();
  pressKey("Home");
  expect(focusedIsoDay()).toBe("2026-11-01");
});

test("pressing the selected day clears the single selection", () => {
  render(<SingleCalendar initialMonth={NOVEMBER_2026} />);
  fireEvent.click(dayButton("2026-11-07"));
  expect(dayCell("2026-11-07")).not.toHaveAttribute("data-selected");
});

test("the first press marks one day and the second closes the range on either side", () => {
  render(<RangeCalendar initialMonth={NOVEMBER_2026} />);
  fireEvent.click(dayButton("2026-11-20"));
  expect(dayCell("2026-11-20")).toHaveAttribute("data-range-start");
  expect(dayCell("2026-11-20")).toHaveAttribute("data-range-end");
  fireEvent.click(dayButton("2026-11-17"));
  expect(dayCell("2026-11-17")).toHaveAttribute("data-range-start");
  expect(dayCell("2026-11-18")).toHaveAttribute("data-range-middle");
  expect(dayButton("2026-11-18")).toHaveAttribute("data-range-middle");
  expect(dayCell("2026-11-20")).toHaveAttribute("data-range-end");
  expect(dayCell("2026-11-18")).toHaveAttribute("aria-selected", "true");
});

test("on a closed range a later day moves the end and an earlier one the start", () => {
  render(<RangeCalendar initialMonth={NOVEMBER_2026} />);
  fireEvent.click(dayButton("2026-11-20"));
  fireEvent.click(dayButton("2026-11-22"));
  fireEvent.click(dayButton("2026-12-03"));
  expect(dayCell("2026-11-20")).toHaveAttribute("data-range-start");
  expect(dayCell("2026-12-03")).toHaveAttribute("data-range-end");
  fireEvent.click(dayButton("2026-11-02"));
  expect(dayCell("2026-11-02")).toHaveAttribute("data-range-start");
  expect(dayCell("2026-12-03")).toHaveAttribute("data-range-end");
});

test("two months show and the next button stops at the end of the year range", () => {
  render(<RangeCalendar initialMonth={NOVEMBER_2026} endMonth={new Date(2026, 11, 31)} />);
  expect(shownMonths()).toEqual(["noviembre 2026", "diciembre 2026"]);
  const next = screen.getByRole("button", { name: "Mes siguiente" });
  expect(next).toHaveAttribute("aria-disabled", "true");
  fireEvent.click(next);
  expect(shownMonths()).toEqual(["noviembre 2026", "diciembre 2026"]);
  fireEvent.click(screen.getByRole("button", { name: "Mes anterior" }));
  expect(shownMonths()).toEqual(["octubre 2026", "noviembre 2026"]);
});

test("each month has its own tabbable day", () => {
  render(<RangeCalendar initialMonth={NOVEMBER_2026} />);
  fireEvent.click(dayButton("2026-11-20"));
  expect(tabbableDays()).toEqual([dayButton("2026-11-20")]);
});

test("the dropdowns change the shown month and year", () => {
  render(<SingleCalendar initialMonth={NOVEMBER_2026} />);
  fireEvent.change(screen.getByRole("combobox", { name: "Elegir el mes" }), { target: { value: "2" } });
  fireEvent.change(screen.getByRole("combobox", { name: "Elegir el año" }), { target: { value: "2030" } });
  expect(shownMonths()).toEqual(["marzo 2030"]);
});

test("a year-first language puts the year dropdown first", () => {
  render(<SingleCalendar initialMonth={NOVEMBER_2026} locale="ja" />);
  const dropdowns = [...document.querySelectorAll(".gdy-calendar-dropdown")].map((select) => select.getAttribute("aria-label"));
  expect(dropdowns).toEqual(["Elegir el año", "Elegir el mes"]);
});

const cellOf = (selector: string) => document.querySelector(`.gdy-calendar-day${selector}`) as HTMLElement;

test("the cell of the focused day carries data-focused while its button has the focus", () => {
  render(<SingleCalendar initialMonth={NOVEMBER_2026} />);
  fireEvent.focus(dayButton("2026-11-07"));
  expect(dayCell("2026-11-07")).toHaveAttribute("data-focused");
  fireEvent.blur(dayButton("2026-11-07"));
  expect(dayCell("2026-11-07")).not.toHaveAttribute("data-focused");
});

test("a day of another month carries its month in data-month, as 1.5.0 did", () => {
  render(<SingleCalendar initialMonth={NOVEMBER_2026} />);
  expect(cellOf('[data-day="2026-12-01"]')).toHaveAttribute("data-month", "2026-12");
  expect(cellOf('[data-day="2026-12-01"]')).toHaveAttribute("data-outside");
  expect(dayCell("2026-11-30")).not.toHaveAttribute("data-month");
});

test("the days before the first year of the dropdown are hidden cells without a button", () => {
  render(<SingleCalendar initialMonth={new Date(2016, 0, 1)} />);
  const hidden = cellOf('[data-day="2015-12-31"]');
  expect(hidden).toHaveAttribute("data-hidden");
  expect(hidden).toBeEmptyDOMElement();
  expect(dayCell("2016-01-01")).not.toHaveAttribute("data-hidden");
});
