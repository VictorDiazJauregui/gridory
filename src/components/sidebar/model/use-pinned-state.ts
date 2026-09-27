import { useState } from "react";
import type { SidebarLayoutProps } from "../types";

type PinnedInput = Pick<SidebarLayoutProps, "pinned" | "defaultPinned" | "onPinnedChange">;

export const usePinnedState = ({ pinned, defaultPinned = false, onPinnedChange }: PinnedInput) => {
  const [uncontrolledPinned, setUncontrolledPinned] = useState(defaultPinned);
  const isControlled = pinned !== undefined;
  const currentPinned = isControlled ? pinned : uncontrolledPinned;
  const setPinned = (nextPinned: boolean) => {
    if (nextPinned === currentPinned) return;
    if (!isControlled) setUncontrolledPinned(nextPinned);
    onPinnedChange?.(nextPinned);
  };
  return { pinned: currentPinned, setPinned };
};
