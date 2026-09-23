import type { CalendarSettings } from "../controls/column-filters";
import { DatePickerWithInput } from "../date-pickers/DatePickerWithInput";
import { DateRangePicker } from "../date-pickers/DateRangePicker";
import type { DateFilterDraft } from "./use-date-filter-draft";

interface DateFilterDatesSectionProps {
  draft: DateFilterDraft;
  settings: CalendarSettings;
}

const toPickerCalendar = (settings: CalendarSettings) => ({
  dateInputFormat: settings.dateInputFormat,
  monthYearDropdown: settings.calendarMonthYearDropdown,
  fromYear: settings.calendarFromYear,
  toYear: settings.calendarToYear,
});

const DraftDatePicker = ({ draft, settings }: DateFilterDatesSectionProps) => (
  <DatePickerWithInput
    value={draft.tempState.date}
    onChange={(date) => draft.patch({ date })}
    {...toPickerCalendar(settings)}
  />
);

const DraftDateRangePicker = ({
  draft,
  settings,
}: DateFilterDatesSectionProps) => (
  <DateRangePicker
    dateFrom={draft.tempState.dateFrom}
    dateTo={draft.tempState.dateTo}
    onChange={(dateFrom, dateTo) => draft.patch({ dateFrom, dateTo })}
    {...toPickerCalendar(settings)}
  />
);

export const DateFilterDatesSection = (props: DateFilterDatesSectionProps) => {
  const { op } = props.draft.tempState;
  if (op === "") return null;
  return (
    <div className="gdy-panel-section">
      <p className="gdy-panel-title">Fechas</p>
      {(op === "gt" || op === "lt") && <DraftDatePicker {...props} />}
      {op === "bt" && <DraftDateRangePicker {...props} />}
    </div>
  );
};
