import { Calendar } from "../../ui/calendar";
import { resolveCalendarCaption } from "./calendar-caption";
import type { CalendarYearRange } from "./calendar-caption";
import { DatePickerField } from "./DatePickerField";
import { useDateRangePicker } from "./use-date-range-picker";
import type { DateRangePickerOptions } from "./use-date-range-picker";

interface DateRangePickerProps
  extends DateRangePickerOptions,
    CalendarYearRange {}

export const DateRangePicker = (props: DateRangePickerProps) => {
  const { popover, fromField, toField, calendar } = useDateRangePicker(props);
  const caption = resolveCalendarCaption(props);
  return (
    <div className="gdy-date-range-inputs">
      <div className="gdy-date-picker-input">
        <input type="text" className="gdy-date-input" {...fromField} />
      </div>
      <DatePickerField
        field={toField}
        popover={popover}
        ariaLabel="Seleccionar rango"
      >
        <Calendar mode="range" numberOfMonths={2} {...calendar} {...caption} />
      </DatePickerField>
    </div>
  );
};
