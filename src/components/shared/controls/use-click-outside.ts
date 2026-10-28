import { useEffect, type RefObject } from "react";

/** Clicks in a portaled popover, calendar or Radix popper count as inside: a date picker keeps the panel open. */
export const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  onOutside: () => void,
) => {
  useEffect(() => {
    const onMouseDown = (event: MouseEvent) => {
      if (!ref.current) return;
      if (ref.current.contains(event.target as Node)) return;

      const target = event.target as HTMLElement;
      if (target.closest('[data-slot="popover-content"]')) return;
      if (target.closest('[data-slot="calendar"]')) return;
      if (target.closest("[data-radix-popper-content-wrapper]")) return;

      onOutside();
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [ref, onOutside]);
};
