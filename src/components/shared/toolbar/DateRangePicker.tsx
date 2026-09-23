import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import type { DateInputFormat } from "../data-model";
import {
  formatDateToInput,
  formatDateToString,
  parseInputToDate,
  parseStringToDate,
} from "../date-utils";

interface DateRangePickerProps {
  dateFrom: string;
  dateTo: string;
  onChange: (from: string, to: string) => void;
  dateInputFormat: DateInputFormat;
  monthYearDropdown: boolean;
  fromYear: number;
  toYear: number;
}

export const DateRangePicker = ({
  dateFrom,
  dateTo,
  onChange,
  dateInputFormat,
  monthYearDropdown,
  fromYear,
  toYear,
}: DateRangePickerProps) => {
  const [open, setOpen] = useState(false);
  const fromDate = useMemo(() => parseStringToDate(dateFrom), [dateFrom]);
  const toDate = useMemo(() => parseStringToDate(dateTo), [dateTo]);
  const [month, setMonth] = useState<Date>(() => fromDate ?? new Date());
  const [range, setRange] = useState<DateRange | undefined>(() =>
    fromDate || toDate ? { from: fromDate, to: toDate } : undefined,
  );
  const [editingFrom, setEditingFrom] = useState(false);
  const [editingTo, setEditingTo] = useState(false);
  const [localFrom, setLocalFrom] = useState("");
  const [localTo, setLocalTo] = useState("");
  const displayFrom = editingFrom
    ? localFrom
    : formatDateToInput(fromDate, dateInputFormat);
  const displayTo = editingTo
    ? localTo
    : formatDateToInput(toDate, dateInputFormat);

  const handleFromInput = (text: string) => {
    setLocalFrom(text);
    setEditingFrom(true);
    const parsed = parseInputToDate(text, dateInputFormat);
    if (!parsed) return;
    onChange(formatDateToString(parsed), dateTo);
    setMonth(parsed);
  };

  const handleToInput = (text: string) => {
    setLocalTo(text);
    setEditingTo(true);
    const parsed = parseInputToDate(text, dateInputFormat);
    if (!parsed) return;
    onChange(dateFrom, formatDateToString(parsed));
  };

  const handleCalendarSelect = (next: DateRange | undefined) => {
    setRange(next);
    onChange(
      next?.from ? formatDateToString(next.from) : "",
      next?.to ? formatDateToString(next.to) : "",
    );
    if (next?.from && next?.to && next.from.getTime() !== next.to.getTime()) {
      setTimeout(() => setOpen(false), 100);
    }
  };

  return (
    <div className="gdy-date-range-inputs">
      <div className="gdy-date-picker-input">
        <input
          type="text"
          className="gdy-date-input"
          placeholder={dateInputFormat}
          value={displayFrom}
          onChange={(e) => handleFromInput(e.target.value)}
          onFocus={() => {
            setLocalFrom(displayFrom);
            setEditingFrom(true);
          }}
          onBlur={() => {
            setEditingFrom(false);
            setLocalFrom("");
          }}
        />
      </div>
      <div className="gdy-date-picker-input">
        <input
          type="text"
          className="gdy-date-input gdy-date-input-with-icon"
          placeholder={dateInputFormat}
          value={displayTo}
          onChange={(e) => handleToInput(e.target.value)}
          onFocus={() => {
            setLocalTo(displayTo);
            setEditingTo(true);
          }}
          onBlur={() => {
            setEditingTo(false);
            setLocalTo("");
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen} modal>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="gdy-date-picker-trigger"
              aria-label="Seleccionar rango"
            >
              <CalendarIcon size={14} className="gdy-date-picker-icon" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="gdy-calendar-popover"
            align="end"
            sideOffset={4}
            onInteractOutside={(e) => e.preventDefault()}
          >
            <Calendar
              mode="range"
              month={month}
              onMonthChange={setMonth}
              selected={range}
              onSelect={handleCalendarSelect}
              numberOfMonths={2}
              captionLayout={monthYearDropdown ? "dropdown" : "label"}
              startMonth={monthYearDropdown ? new Date(fromYear, 0, 1) : undefined}
              endMonth={monthYearDropdown ? new Date(toYear, 11, 31) : undefined}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
