import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import type { CalendarLabels } from "./calendar-labels";

interface CalendarNavProps {
  labels: Pick<CalendarLabels, "calendarNavigation" | "calendarPreviousMonth" | "calendarNextMonth">;
  canStepMonths: (step: number) => boolean;
  stepMonths: (step: number) => void;
}

interface MonthStepButtonProps extends Pick<CalendarNavProps, "canStepMonths" | "stepMonths"> {
  step: -1 | 1;
  label: string;
}

// aria-disabled rather than disabled, as in the 1.x calendar: the button that reaches the year range keeps its focus.
const MonthStepButton = ({ step, label, canStepMonths, stepMonths }: MonthStepButtonProps) => {
  const isEnabled = canStepMonths(step);
  const Chevron = step < 0 ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      className={step < 0 ? "gdy-calendar-button-previous" : "gdy-calendar-button-next"}
      tabIndex={isEnabled ? undefined : -1}
      aria-disabled={isEnabled ? undefined : true}
      aria-label={label}
      onClick={() => isEnabled && stepMonths(step)}
    >
      <Chevron className="gdy-calendar-chevron" />
    </button>
  );
};

export const CalendarNav = ({ labels, ...navigation }: CalendarNavProps) => (
  <nav className="gdy-calendar-nav" aria-label={labels.calendarNavigation}>
    <MonthStepButton step={-1} label={labels.calendarPreviousMonth} {...navigation} />
    <MonthStepButton step={1} label={labels.calendarNextMonth} {...navigation} />
  </nav>
);
