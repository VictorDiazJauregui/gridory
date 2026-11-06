import type { CalendarSettings } from "../controls/column-filters";
import type { DateFilterMenuLabels } from "../labels/data-view-labels";
import type { DeferredModuleState } from "../deferred/use-deferred-module";
import type { DatePickersBundle } from "../date-pickers/deferred-date-pickers";
import { buildLoadingRootAttributes } from "../loading/loading-state";
import { DatePickersPlaceholder } from "./DatePickersPlaceholder";
import { DatePickersLoadError } from "./DatePickersLoadError";
import type { DateFilterDraft } from "./use-date-filter-draft";

type DatesSectionLabels = Pick<
  DateFilterMenuLabels,
  "datesTitle" | "pickDate" | "pickRange" | "dateLoadError" | "dateLoadRetry"
>;

interface DateFilterDatesSectionProps {
  draft: DateFilterDraft;
  settings: CalendarSettings & { labels: DatesSectionLabels };
  pickers: DeferredModuleState<DatePickersBundle>;
}

interface DraftPickerProps extends Omit<DateFilterDatesSectionProps, "pickers"> {
  pickers: DatePickersBundle;
}

const toPickerCalendar = (settings: CalendarSettings) => ({
  dateInputFormat: settings.dateInputFormat,
  monthYearDropdown: settings.calendarMonthYearDropdown,
  fromYear: settings.calendarFromYear,
  toYear: settings.calendarToYear,
  locale: settings.calendarLocale,
});

const DraftDatePicker = ({ draft, settings, pickers }: DraftPickerProps) => (
  <pickers.DatePickerWithInput
    value={draft.tempState.date}
    onChange={(date) => draft.patch({ date })}
    ariaLabel={settings.labels.pickDate}
    {...toPickerCalendar(settings)}
  />
);

const DraftDateRangePicker = ({ draft, settings, pickers }: DraftPickerProps) => (
  <pickers.DateRangePicker
    dateFrom={draft.tempState.dateFrom}
    dateTo={draft.tempState.dateTo}
    onChange={(dateFrom, dateTo) => draft.patch({ dateFrom, dateTo })}
    ariaLabel={settings.labels.pickRange}
    {...toPickerCalendar(settings)}
  />
);

const DatesSectionContent = ({ pickers, ...props }: DateFilterDatesSectionProps) => {
  const isRange = props.draft.tempState.op === "bt";
  if (pickers.status === "failed") return <DatePickersLoadError labels={props.settings.labels} onRetry={pickers.retry} />;
  if (!pickers.module) return <DatePickersPlaceholder isRange={isRange} />;
  if (isRange) return <DraftDateRangePicker {...props} pickers={pickers.module} />;
  return <DraftDatePicker {...props} pickers={pickers.module} />;
};

export const DateFilterDatesSection = (props: DateFilterDatesSectionProps) => {
  if (props.draft.tempState.op === "") return null;
  return (
    <div className="gdy-panel-section" {...buildLoadingRootAttributes(props.pickers.status === "loading")}>
      <p className="gdy-panel-title">{props.settings.labels.datesTitle}</p>
      <DatesSectionContent {...props} />
    </div>
  );
};
