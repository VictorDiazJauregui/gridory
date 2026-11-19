import { useEffect, useState } from "react";

const SCROLL_GESTURES = ["wheel", "touchmove"] as const;

const keepGestureInPanel = (event: Event): void => event.stopPropagation();

// Modal scroll locks (react-remove-scroll in Radix Dialog and Sheet) cancel any wheel or touch move born outside the
// dialog's DOM. The panel lives in <body>, so its gestures stop here and the browser scrolls the list as usual.
export const useContainedScrollGestures = () => {
  const [panel, setPanel] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!panel) return undefined;
    SCROLL_GESTURES.forEach((gesture) => panel.addEventListener(gesture, keepGestureInPanel, { passive: true }));
    return () => SCROLL_GESTURES.forEach((gesture) => panel.removeEventListener(gesture, keepGestureInPanel));
  }, [panel]);
  return setPanel;
};
