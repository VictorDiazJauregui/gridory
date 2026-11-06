/**
 * Language of the calendar: a BCP 47 tag (`"en-US"`) or any object with a `code`, such as a `date-fns` locale, so
 * code written for the 1.x calendar keeps compiling. `options.weekStartsOn` (0 = Sunday) overrides the first day.
 */
export type CalendarLocale = string | { code?: string; options?: { weekStartsOn?: number } };

export interface ResolvedCalendarLocale {
  code: string;
  weekStartsOn: number;
}

interface WeekInfo {
  firstDay: number;
}

type LocaleWithWeekInfo = Intl.Locale & { getWeekInfo?: () => WeekInfo; weekInfo?: WeekInfo };

const DEFAULT_LOCALE_CODE = "es";
const MONDAY = 1;
const DAYS_PER_WEEK = 7;

// Older Chrome and Safari expose weekInfo as a getter, and Firefox has neither: there the week starts on Monday
// (ISO 8601), and a consumer who needs Sunday passes `options.weekStartsOn`, which a date-fns locale already carries.
const readWeekStart = (code: string): number => {
  const locale = new Intl.Locale(code) as LocaleWithWeekInfo;
  const weekInfo = locale.getWeekInfo?.() ?? locale.weekInfo;
  return weekInfo ? weekInfo.firstDay % DAYS_PER_WEEK : MONDAY;
};

export const resolveCalendarLocale = (locale: CalendarLocale | undefined): ResolvedCalendarLocale => {
  if (typeof locale === "string") return { code: locale, weekStartsOn: readWeekStart(locale) };
  const code = locale?.code ?? DEFAULT_LOCALE_CODE;
  return { code, weekStartsOn: locale?.options?.weekStartsOn ?? readWeekStart(code) };
};
