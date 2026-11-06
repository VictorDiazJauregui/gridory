import type { CSSProperties } from "react";
import { ChevronDownIcon } from "lucide-react";

import type { CalendarFormatters } from "./calendar-formatters";
import type { CalendarLabels } from "./calendar-labels";

const DROPDOWN_CHEVRON_SIZE = 18;
const MONTHS_PER_YEAR = 12;

// Inline, as react-day-picker wrote it in 1.x: a class would add a style hook the 1.x calendar did not have.
const VISUALLY_HIDDEN: CSSProperties = {
  border: 0,
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  width: 1,
  whiteSpace: "nowrap",
  wordWrap: "normal",
};

interface DropdownOption {
  value: number;
  text: string;
}

interface CaptionDropdownProps {
  className: string;
  label: string;
  value: number;
  options: DropdownOption[];
  onChange: (value: number) => void;
}

// The native select lies invisible over the label (see styles.css), so a phone opens its own picker.
const CaptionDropdown = ({ className, label, value, options, onChange }: CaptionDropdownProps) => (
  <span data-disabled={false} className="gdy-calendar-dropdown-root">
    <select className={className} aria-label={label} value={value} onChange={(event) => onChange(Number(event.target.value))}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.text}
        </option>
      ))}
    </select>
    <span className="gdy-calendar-caption-label" aria-hidden="true">
      {options.find((option) => option.value === value)?.text}
      <ChevronDownIcon size={DROPDOWN_CHEVRON_SIZE} className="gdy-calendar-chevron" />
    </span>
  </span>
);

export interface CalendarCaptionProps {
  month: Date;
  formatters: CalendarFormatters;
  labels: Pick<CalendarLabels, "calendarChooseMonth" | "calendarChooseYear">;
  /** Years of the dropdown; without them the caption is plain text. */
  years?: number[];
  showMonth: (month: Date) => void;
}

const buildMonthOptions = (year: number, formatters: CalendarFormatters): DropdownOption[] =>
  Array.from({ length: MONTHS_PER_YEAR }, (_, month) => ({
    value: month,
    text: formatters.formatMonthOption(new Date(year, month, 1)),
  }));

const CaptionDropdowns = ({ month, formatters, labels, years = [], showMonth }: CalendarCaptionProps) => {
  const year = month.getFullYear();
  const monthDropdown = (
    <CaptionDropdown key="month" className="gdy-calendar-dropdown gdy-calendar-months-dropdown" label={labels.calendarChooseMonth}
      value={month.getMonth()} options={buildMonthOptions(year, formatters)} onChange={(value) => showMonth(new Date(year, value, 1))} />
  );
  const yearDropdown = (
    <CaptionDropdown key="year" className="gdy-calendar-dropdown gdy-calendar-years-dropdown" label={labels.calendarChooseYear}
      value={year} options={years.map((value) => ({ value, text: String(value) }))} onChange={(value) => showMonth(new Date(value, month.getMonth(), 1))} />
  );
  return formatters.isYearFirst ? [yearDropdown, monthDropdown] : [monthDropdown, yearDropdown];
};

export const CalendarCaption = (props: CalendarCaptionProps) => {
  const caption = props.formatters.formatCaption(props.month);
  if (!props.years) {
    return (
      <div className="gdy-calendar-month-caption">
        <span className="gdy-calendar-caption-label" role="status" aria-live="polite">{caption}</span>
      </div>
    );
  }
  return (
    <div className="gdy-calendar-month-caption">
      <div className="gdy-calendar-dropdowns">
        <CaptionDropdowns {...props} />
        <span role="status" aria-live="polite" style={VISUALLY_HIDDEN}>{caption}</span>
      </div>
    </div>
  );
};
