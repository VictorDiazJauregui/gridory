import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

const HOVER_DELAY_MS = 200;

// Hover (after a short delay) and keyboard focus open it, a click or tap toggles it and Escape closes it: the same
// rules the Radix tooltip followed plus the tap a phone needs.
const useDelayedOpen = () => {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timerRef.current), []);
  const openLater = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    timerRef.current = window.setTimeout(() => setOpen(true), HOVER_DELAY_MS);
  };
  const close = () => {
    window.clearTimeout(timerRef.current);
    setOpen(false);
  };
  return { open, setOpen, openLater, close };
};

export const useHelpTooltip = () => {
  const { open, setOpen, openLater, close } = useDelayedOpen();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") close();
  };
  const triggerHandlers = {
    onPointerEnter: openLater, onPointerLeave: close, onBlur: close, onKeyDown: closeOnEscape,
    onFocus: () => triggerRef.current?.matches(":focus-visible") && setOpen(true),
    onClick: () => setOpen((wasOpen) => !wasOpen),
  };
  return { open, triggerRef, triggerHandlers };
};
