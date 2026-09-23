import { useMemo, useState } from "react";
import { formatDateToString, parseStringToDate } from "../date-filter";
import { useCalendarPopover } from "./use-calendar-popover";
import { useMaskedDateInput } from "./use-masked-date-input";
import type { DateInputMask } from "./use-masked-date-input";

export interface SingleDatePickerOptions extends DateInputMask {
  value: string;
  onChange: (value: string) => void;
}

export const useSingleDatePicker = (props: SingleDatePickerOptions) => {
  const { value, onChange } = props;
  const popover = useCalendarPopover();
  const selected = useMemo(() => parseStringToDate(value), [value]);
  const [month, setMonth] = useState<Date | undefined>(selected);
  const commitDate = (date: Date) => {
    onChange(formatDateToString(date));
    setMonth(date);
  };
  const input = useMaskedDateInput(selected, commitDate, props);
  const onSelect = (date: Date | undefined) => {
    if (date) commitDate(date);
    popover.setOpen(false);
    input.stopEditing();
  };
  const calendar = { selected, month, onMonthChange: setMonth, onSelect };
  return { popover, field: input.field, calendar };
};
