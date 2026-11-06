export interface CalendarFormatters {
  isYearFirst: boolean;
  formatCaption: (month: Date) => string;
  formatMonthOption: (month: Date) => string;
  formatWeekdayName: (day: Date) => string;
  formatWeekdayAbbreviation: (day: Date) => string;
  formatDayName: (day: Date) => string;
}

const WEEKDAY_ABBREVIATION_LENGTH = 2;

const MONTH_AND_YEAR: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };

const readsYearFirst = (code: string): boolean => {
  const partTypes = new Intl.DateTimeFormat(code, MONTH_AND_YEAR).formatToParts(new Date()).map((part) => part.type);
  return partTypes.indexOf("year") < partTypes.indexOf("month");
};

// The 1.x calendar wrote "noviembre 2026" rather than Intl's "noviembre de 2026", and Intl's own text only where
// the year goes first ("2026年11月").
const buildCaptionFormatter = (code: string, isYearFirst: boolean) => {
  const monthAndYear = new Intl.DateTimeFormat(code, MONTH_AND_YEAR);
  if (isYearFirst) return (month: Date) => monthAndYear.format(month);
  const monthName = new Intl.DateTimeFormat(code, { month: "long" });
  return (month: Date) => `${monthName.format(month)} ${month.getFullYear()}`;
};

export const buildCalendarFormatters = (code: string): CalendarFormatters => {
  const isYearFirst = readsYearFirst(code);
  const monthOption = new Intl.DateTimeFormat(code, { month: "short" });
  const weekdayName = new Intl.DateTimeFormat(code, { weekday: "long" });
  const weekdayAbbreviation = new Intl.DateTimeFormat(code, { weekday: "short" });
  const dayName = new Intl.DateTimeFormat(code, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return {
    isYearFirst,
    formatCaption: buildCaptionFormatter(code, isYearFirst),
    formatMonthOption: (month) => monthOption.format(month),
    formatWeekdayName: (day) => weekdayName.format(day),
    // Two letters ("lu", "Mo"), like the 1.x calendar, so seven columns fit a phone.
    formatWeekdayAbbreviation: (day) => weekdayAbbreviation.format(day).slice(0, WEEKDAY_ABBREVIATION_LENGTH),
    formatDayName: (day) => dayName.format(day),
  };
};
