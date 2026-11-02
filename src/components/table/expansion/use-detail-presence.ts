import { useEffect, useRef, useState } from "react";

const EXIT_MARGIN_IN_MS = 50;

const readLongestTransition = (element: Element) => {
  const { transitionDuration, transitionDelay } = getComputedStyle(element);
  const toMs = (value: string) => value.split(",").map((part) => Number.parseFloat(part) * 1000 || 0);
  const durations = toMs(transitionDuration);
  const delays = toMs(transitionDelay);
  return Math.max(0, ...durations.map((duration, index) => duration + (delays[index] ?? 0)));
};

// Calls `onExit` once the closing transition ends. A transition that never runs (closed before it opened, or
// hidden) fires no `transitionend`, so a timer of the same length backs it up; with no transition, next frame.
const waitForPanelExit = (panel: HTMLDivElement, onExit: () => void) => {
  const longest = readLongestTransition(panel);
  if (longest === 0) {
    const frame = requestAnimationFrame(onExit);
    return () => cancelAnimationFrame(frame);
  }
  const exit = (event: TransitionEvent) => event.target === panel && onExit();
  const timer = setTimeout(onExit, longest + EXIT_MARGIN_IN_MS);
  panel.addEventListener("transitionend", exit);
  return () => {
    clearTimeout(timer);
    panel.removeEventListener("transitionend", exit);
  };
};

/** Keeps a closing detail mounted until its panel transition ends; with no transition it leaves on the next frame. */
export const useDetailPresence = (isOpen: boolean) => {
  const [isRendered, setRendered] = useState(isOpen);
  const panelRef = useRef<HTMLDivElement>(null);
  if (isOpen && !isRendered) setRendered(true);
  useEffect(() => {
    const panel = panelRef.current;
    if (isOpen || !panel) return;
    return waitForPanelExit(panel, () => setRendered(false));
  }, [isOpen]);
  return { isRendered, panelRef };
};
