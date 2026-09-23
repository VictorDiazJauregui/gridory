import { useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "../../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import type { DateInputFormat } from "../data-model";
import {
  formatDateToInput,
  formatDateToString,
  parseInputToDate,
  parseStringToDate,
} from "../date-filter";

interface DatePickerWithInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  dateInputFormat: DateInputFormat;
  monthYearDropdown: boolean;
  fromYear: number;
  toYear: number;
}

export const DatePickerWithInput = ({
  value,
  onChange,
  dateInputFormat,
  placeholder = dateInputFormat,
  monthYearDropdown,
  fromYear,
  toYear,
}: DatePickerWithInputProps) => {
  const [open, setOpen] = useState(false);
  const selectedDate = useMemo(() => parseStringToDate(value), [value]);
  const [month, setMonth] = useState<Date | undefined>(selectedDate);
  const [localInput, setLocalInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const formattedDate = selectedDate
    ? formatDateToInput(selectedDate, dateInputFormat)
    : "";
  const displayValue = isEditing ? localInput : formattedDate;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentValue = event.target.value;
    setLocalInput(currentValue);
    setIsEditing(true);

    const parsed = parseInputToDate(currentValue, dateInputFormat);
    if (parsed) {
      onChange(formatDateToString(parsed));
      setMonth(parsed);
    }
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    setLocalInput("");
  };

  const handleInputFocus = () => {
    setLocalInput(
      selectedDate ? formatDateToInput(selectedDate, dateInputFormat) : "",
    );
    setIsEditing(true);
  };

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(formatDateToString(date));
      setMonth(date);
    }
    setOpen(false);
    setIsEditing(false);
  };

  return (
    <div className="gdy-date-picker-input">
      <input
        type="text"
        className="gdy-date-input gdy-date-input-with-icon"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="gdy-date-picker-trigger"
            aria-label="Seleccionar fecha"
          >
            <CalendarIcon size={14} className="gdy-date-picker-icon" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="gdy-calendar-popover"
          align="end"
          sideOffset={4}
          onInteractOutside={(event) => event.preventDefault()}
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            month={month}
            onMonthChange={setMonth}
            onSelect={handleSelect}
            captionLayout={monthYearDropdown ? "dropdown" : "label"}
            startMonth={monthYearDropdown ? new Date(fromYear, 0, 1) : undefined}
            endMonth={monthYearDropdown ? new Date(toYear, 11, 31) : undefined}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
