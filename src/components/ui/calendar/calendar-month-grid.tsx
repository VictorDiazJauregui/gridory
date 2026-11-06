import { buildMonthWeeks, toIsoDay } from "./calendar-dates";
import { CalendarDay, type CalendarDayContext } from "./calendar-day";

export interface CalendarMonthGridProps {
  month: Date;
  weekStartsOn: number;
  context: CalendarDayContext;
}

const CalendarWeekdays = ({ week, context }: { week: Date[]; context: CalendarDayContext }) => (
  <thead aria-hidden="true">
    <tr className="gdy-calendar-weekdays">
      {week.map((day) => (
        <th key={day.getDay()} className="gdy-calendar-weekday" scope="col" aria-label={context.formatters.formatWeekdayName(day)}>
          {context.formatters.formatWeekdayAbbreviation(day)}
        </th>
      ))}
    </tr>
  </thead>
);

export const CalendarMonthGrid = ({ month, weekStartsOn, context }: CalendarMonthGridProps) => {
  const weeks = buildMonthWeeks(month, weekStartsOn);
  return (
    <table role="grid" className="gdy-calendar-month-grid" aria-label={context.formatters.formatCaption(month)}
      aria-multiselectable={context.selection.mode === "range"}>
      <CalendarWeekdays week={weeks[0]} context={context} />
      <tbody className="gdy-calendar-weeks">
        {weeks.map((week) => (
          <tr key={toIsoDay(week[0])} className="gdy-calendar-week">
            {week.map((day) => <CalendarDay key={toIsoDay(day)} day={day} month={month} context={context} />)}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
