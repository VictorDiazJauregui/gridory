import { Calendar } from "../../ui/calendar";
import { resolveCalendarCaption } from "./calendar-caption";
import type { CalendarYearRange } from "./calendar-caption";
import { DatePickerField } from "./DatePickerField";
import { useSingleDatePicker } from "./use-single-date-picker";
import type { SingleDatePickerOptions } from "./use-single-date-picker";

interface DatePickerWithInputProps
  extends SingleDatePickerOptions,
    CalendarYearRange {}

export const DatePickerWithInput = (props: DatePickerWithInputProps) => {
  const { popover, field, calendar } = useSingleDatePicker(props);
  const caption = resolveCalendarCaption(props);
  return (
    <DatePickerField
      field={field}
      popover={popover}
      ariaLabel="Seleccionar fecha"
    >
      <Calendar mode="single" {...calendar} {...caption} />
    </DatePickerField>
  );
};
