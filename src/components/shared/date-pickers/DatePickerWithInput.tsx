import { Calendar } from "../../ui/calendar/calendar";
import { resolveCalendarCaption } from "./calendar-caption";
import type { CalendarTexts, CalendarYearRange } from "./calendar-caption";
import { DatePickerField } from "./DatePickerField";
import { useSingleDatePicker } from "./use-single-date-picker";
import type { SingleDatePickerOptions } from "./use-single-date-picker";

interface DatePickerWithInputProps
  extends SingleDatePickerOptions,
    CalendarYearRange,
    CalendarTexts {}

export const DatePickerWithInput = (props: DatePickerWithInputProps) => {
  const { popover, field, calendar } = useSingleDatePicker(props);
  const caption = resolveCalendarCaption(props);
  return (
    <DatePickerField
      field={field}
      popover={popover}
      ariaLabel={props.ariaLabel}
    >
      <Calendar mode="single" locale={props.locale} {...calendar} {...caption} />
    </DatePickerField>
  );
};
