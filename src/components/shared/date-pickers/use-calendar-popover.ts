import { useState } from "react";
import type { KeyboardEvent } from "react";

export interface CalendarPopoverControl {
  open: boolean;
  setOpen: (open: boolean) => void;
  openOnArrowDown: (event: KeyboardEvent<HTMLInputElement>) => void;
}

export const useCalendarPopover = (): CalendarPopoverControl => {
  const [open, setOpen] = useState(false);
  const openOnArrowDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowDown") return;
    event.preventDefault();
    setOpen(true);
  };
  return { open, setOpen, openOnArrowDown };
};
