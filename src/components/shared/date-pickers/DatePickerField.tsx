import type { ReactNode } from "react";

import { CalendarPopover } from "./CalendarPopover";
import type { CalendarPopoverControl } from "./use-calendar-popover";
import type { MaskedDateField } from "./use-masked-date-input";

interface DatePickerFieldProps {
  field: MaskedDateField;
  popover: CalendarPopoverControl;
  ariaLabel: string;
  children: ReactNode;
}

export const DatePickerField = ({
  field,
  popover,
  ariaLabel,
  children,
}: DatePickerFieldProps) => (
  <div className="gdy-date-picker-input">
    <input
      type="text"
      className="gdy-date-input gdy-date-input-with-icon"
      {...field}
      onKeyDown={popover.openOnArrowDown}
    />
    <CalendarPopover popover={popover} ariaLabel={ariaLabel}>
      {children}
    </CalendarPopover>
  </div>
);
