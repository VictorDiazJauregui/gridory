import type { ReactNode } from "react";
import { CalendarIcon } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import type { CalendarPopoverControl } from "./use-calendar-popover";

interface CalendarPopoverProps {
  popover: CalendarPopoverControl;
  ariaLabel: string;
  children: ReactNode;
}

const CalendarTrigger = ({ ariaLabel }: { ariaLabel: string }) => (
  <PopoverTrigger asChild>
    <button
      type="button"
      className="gdy-date-picker-trigger"
      aria-label={ariaLabel}
    >
      <CalendarIcon size={14} className="gdy-date-picker-icon" />
    </button>
  </PopoverTrigger>
);

export const CalendarPopover = ({
  popover,
  ariaLabel,
  children,
}: CalendarPopoverProps) => (
  <Popover open={popover.open} onOpenChange={popover.setOpen} modal>
    <CalendarTrigger ariaLabel={ariaLabel} />
    <PopoverContent
      className="gdy-calendar-popover"
      align="end"
      sideOffset={4}
      onInteractOutside={(event) => event.preventDefault()}
    >
      {children}
    </PopoverContent>
  </Popover>
);
