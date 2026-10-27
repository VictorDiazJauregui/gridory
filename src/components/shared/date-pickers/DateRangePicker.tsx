import { Calendar } from "../../ui/calendar/calendar";
import { resolveCalendarCaption } from "./calendar-caption";
import type { CalendarTexts, CalendarYearRange } from "./calendar-caption";
import { DatePickerField } from "./DatePickerField";
import { useDateRangePicker } from "./use-date-range-picker";
import type { DateRangePickerOptions } from "./use-date-range-picker";

interface DateRangePickerProps
  extends DateRangePickerOptions,
    CalendarYearRange,
    CalendarTexts {}

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
        ariaLabel={props.ariaLabel}
      >
        <Calendar mode="range" numberOfMonths={2} locale={props.locale} {...calendar} {...caption} />
      </DatePickerField>
    </div>
  );
};
