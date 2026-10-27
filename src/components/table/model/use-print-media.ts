import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

const PRINT_QUERY = "print";

const readPrintMedia = () =>
  typeof window.matchMedia === "function" && window.matchMedia(PRINT_QUERY).matches;

// `beforeprint` and `afterprint` bracket the browser's print (Ctrl+P, `window.print()`); the media
// query also covers a print preview or an emulated print media, which fire no print events.
const subscribeToPrint = (onChange: (printing: boolean) => void) => {
  const query = typeof window.matchMedia === "function" ? window.matchMedia(PRINT_QUERY) : null;
  const onQueryChange = (event: MediaQueryListEvent) => onChange(event.matches);
  const onBeforePrint = () => onChange(true);
  const onAfterPrint = () => onChange(false);
  query?.addEventListener("change", onQueryChange);
  window.addEventListener("beforeprint", onBeforePrint);
  window.addEventListener("afterprint", onAfterPrint);
  return () => {
    query?.removeEventListener("change", onQueryChange);
    window.removeEventListener("beforeprint", onBeforePrint);
    window.removeEventListener("afterprint", onAfterPrint);
  };
};

/** Whether the page is being printed, while `enabled`. */
export const usePrintMedia = (enabled: boolean) => {
  const [printing, setPrinting] = useState(readPrintMedia);
  useEffect(() => {
    if (!enabled) return;
    // The browser lays out the printed page right after these events: a normal state update
    // would render too late and print the screen rows, so the render is flushed on the spot.
    return subscribeToPrint((next) => flushSync(() => setPrinting(next)));
  }, [enabled]);
  return enabled && printing;
};
