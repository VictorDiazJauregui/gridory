import type { CalendarFormatters } from "./calendar-formatters";
import type { CalendarLabels } from "./calendar-labels";
import { isSameDay, isSameMonth, toIsoDay } from "./calendar-dates";
import { markDay, type CalendarSelection } from "./calendar-selection";

export interface CalendarDayContext {
  code: string;
  formatters: CalendarFormatters;
  labels: Pick<CalendarLabels, "calendarToday">;
  selection: CalendarSelection;
  isTabbable: (day: Date, month: Date) => boolean;
  isFocused: (day: Date, month: Date) => boolean;
  /** Days past the year range of the dropdowns: an empty cell, as in 1.x. */
  isHidden: (day: Date) => boolean;
  pressDay: (day: Date) => void;
  focusDay: (day: Date, month: Date) => void;
  blurDay: () => void;
}

interface CalendarDayProps {
  day: Date;
  month: Date;
  context: CalendarDayContext;
}

const buildRangeAttributes = (day: Date, selection: CalendarSelection) => {
  const marks = markDay(selection, day);
  const range = {
    "data-range-start": marks.rangeStart || undefined,
    "data-range-middle": marks.rangeMiddle || undefined,
    "data-range-end": marks.rangeEnd || undefined,
  };
  return { marks, range };
};

// The same attributes and values the 1.x calendar wrote, so styles.css and the consumers' overrides keep matching.
const buildCellAttributes = ({ day, month, context }: CalendarDayProps, isSelected: boolean) => {
  const isOutside = !isSameMonth(day, month);
  return {
    "aria-selected": isSelected || undefined,
    "data-day": toIsoDay(day),
    "data-month": isOutside ? toIsoDay(day).slice(0, 7) : undefined,
    "data-selected": isSelected || undefined,
    "data-hidden": context.isHidden(day) || undefined,
    "data-outside": isOutside || undefined,
    "data-focused": context.isFocused(day, month) || undefined,
    "data-today": isSameDay(day, new Date()) || undefined,
  };
};

const buildDayName = (day: Date, context: CalendarDayContext): string => {
  const name = context.formatters.formatDayName(day);
  return isSameDay(day, new Date()) ? `${context.labels.calendarToday}, ${name}` : name;
};

const DayButton = ({ day, month, context, range, isSingle }: CalendarDayProps & { range: object; isSingle: boolean }) => (
  <button className="gdy-calendar-day-button" data-day={day.toLocaleDateString(context.code)}
    data-selected-single={isSingle || undefined} {...range} type="button" tabIndex={context.isTabbable(day, month) ? 0 : -1}
    aria-label={buildDayName(day, context)} onClick={() => context.pressDay(day)}
    onFocus={() => context.focusDay(day, month)} onBlur={context.blurDay}>
    {day.getDate()}
  </button>
);

export const CalendarDay = (props: CalendarDayProps) => {
  const { marks, range } = buildRangeAttributes(props.day, props.context.selection);
  const cell = buildCellAttributes(props, marks.selected);
  return (
    <td className="gdy-calendar-day" role="gridcell" {...cell} {...range}>
      {!cell["data-hidden"] && <DayButton {...props} range={range} isSingle={marks.single} />}
    </td>
  );
};
