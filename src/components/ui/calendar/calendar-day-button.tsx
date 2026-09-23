import * as React from "react";
import type { DayButton, Locale, Modifiers } from "react-day-picker";

import { isSingleSelection, rangeAttributes } from "./calendar-modifiers";

type CalendarDayButtonProps = React.ComponentProps<typeof DayButton> & {
  locale?: Partial<Locale>;
};

const dayButtonAttributes = (
  day: CalendarDayButtonProps["day"],
  modifiers: Modifiers,
  locale?: Partial<Locale>,
) => ({
  "data-day": day.date.toLocaleDateString(locale?.code),
  "data-selected-single": isSingleSelection(modifiers) || undefined,
  ...rangeAttributes(modifiers),
});

/**
 * Own day button: the hook comes from `classNames.day_button`. Like the default
 * DayButton of react-day-picker, it takes the DOM focus when the picker marks
 * the day as focused (arrow keys, Home/End, PageUp/PageDown).
 */
const CalendarDayButton = ({
  className,
  day,
  modifiers,
  locale,
  ...props
}: CalendarDayButtonProps) => {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <button
      ref={ref}
      className={className}
      {...dayButtonAttributes(day, modifiers, locale)}
      {...props}
    />
  );
}

export { CalendarDayButton };
