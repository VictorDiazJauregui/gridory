export const formatDateTimeByDefault = (date: Date, locale?: string): string =>
  new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" }).format(date);
