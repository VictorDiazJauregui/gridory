export const applyPropDefaults = <
  TProps extends object,
  TDefaults extends Partial<TProps>,
>(
  defaults: TDefaults,
  props: TProps,
): TProps & TDefaults => {
  const resolved: Record<string, unknown> = { ...defaults };
  for (const [key, value] of Object.entries(props)) {
    if (value !== undefined) resolved[key] = value;
  }
  return resolved as TProps & TDefaults;
};

export const resolveCalendarYearDefaults = () => {
  const currentYear = new Date().getFullYear();
  return { calendarFromYear: currentYear - 100, calendarToYear: currentYear + 10 };
};
