import { useEffect, useState } from "react";

const PINNED_STORAGE_KEY = "gridory-demo-sidebar-pinned";

const readStoredPinned = (): boolean => {
  try {
    return window.localStorage.getItem(PINNED_STORAGE_KEY) === "true";
  } catch {
    // Storage unavailable (private mode or blocked): start unpinned.
    return false;
  }
};

// The library only emits onPinnedChange; remembering it is the app's call.
export const useDemoPinned = () => {
  const [pinned, setPinned] = useState(readStoredPinned);
  useEffect(() => {
    try {
      window.localStorage.setItem(PINNED_STORAGE_KEY, String(pinned));
    } catch {
      // Storage unavailable: the choice simply is not remembered.
    }
  }, [pinned]);
  return { pinned, setPinned };
};
