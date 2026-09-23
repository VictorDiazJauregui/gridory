import { useEffect, useRef } from "react";

export const useFocusOnOpen = (open: boolean) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 250);
    return () => window.clearTimeout(timer);
  }, [open]);
  return inputRef;
};
