import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import type { DateInputFormat } from "../data-model";
import { formatDateToString, parseStringToDate } from "../date-filter";
import { useCalendarPopover } from "./use-calendar-popover";
import { useMaskedDateInput } from "./use-masked-date-input";

interface DateRangeValue {
  dateFrom: string;
  dateTo: string;
  onChange: (from: string, to: string) => void;
}

export interface DateRangePickerOptions extends DateRangeValue {
  dateInputFormat: DateInputFormat;
}

const formatRangeBounds = (next: DateRange | undefined): [string, string] => [
  next?.from ? formatDateToString(next.from) : "",
  next?.to ? formatDateToString(next.to) : "",
];

const spansDifferentDays = (next: DateRange | undefined) =>
  next?.from && next?.to && next.from.getTime() !== next.to.getTime();

const useDateRangeCalendar = (
  { dateFrom, dateTo, onChange }: DateRangeValue,
  setOpen: (open: boolean) => void,
) => {
  const fromDate = useMemo(() => parseStringToDate(dateFrom), [dateFrom]);
  const toDate = useMemo(() => parseStringToDate(dateTo), [dateTo]);
  const [month, setMonth] = useState<Date>(() => fromDate ?? new Date());
  const [selected, setSelected] = useState<DateRange | undefined>(() =>
    fromDate || toDate ? { from: fromDate, to: toDate } : undefined,
  );
  const onSelect = (next: DateRange | undefined) => {
    setSelected(next);
    onChange(...formatRangeBounds(next));
    if (spansDifferentDays(next)) setTimeout(() => setOpen(false), 100);
  };
  const calendar = { month, onMonthChange: setMonth, selected, onSelect };
  return { fromDate, toDate, setMonth, calendar };
};

export const useDateRangePicker = (props: DateRangePickerOptions) => {
  const { dateFrom, dateTo, onChange } = props;
  const popover = useCalendarPopover();
  const range = useDateRangeCalendar(props, popover.setOpen);
  const commitFrom = (date: Date) => {
    onChange(formatDateToString(date), dateTo);
    range.setMonth(date);
  };
  const commitTo = (date: Date) => onChange(dateFrom, formatDateToString(date));
  const fromField = useMaskedDateInput(range.fromDate, commitFrom, props).field;
  const toField = useMaskedDateInput(range.toDate, commitTo, props).field;
  return { popover, fromField, toField, calendar: range.calendar };
};
