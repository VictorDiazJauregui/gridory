import { useEffect, useMemo, useState } from "react";

const lockPageScroll = (): (() => void) => {
  const root = document.documentElement;
  const previousOverflow = root.style.overflow;
  root.style.overflow = "hidden";
  return () => {
    root.style.overflow = previousOverflow;
  };
};

const exitOnEscape = (exit: () => void): (() => void) => {
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && !event.defaultPrevented) exit();
  };
  document.addEventListener("keydown", onKeyDown);
  return () => document.removeEventListener("keydown", onKeyDown);
};

export const useFullscreenState = (onFullscreenChange?: (fullscreen: boolean) => void) => {
  const [fullscreen, setFullscreen] = useState(false);
  const changeFullscreen = useMemo(
    () => (next: boolean) => {
      setFullscreen(next);
      onFullscreenChange?.(next);
    },
    [onFullscreenChange],
  );
  useEffect(() => {
    if (!fullscreen) return undefined;
    const unlock = lockPageScroll();
    const stopListening = exitOnEscape(() => changeFullscreen(false));
    return () => {
      unlock();
      stopListening();
    };
  }, [fullscreen, changeFullscreen]);
  return { fullscreen, changeFullscreen };
};
