import { useEffect, useRef } from "react";
import type { Dispatch, PointerEvent } from "react";
import type { SidebarInteractionEvent } from "../model/interaction-state";
import type { SidebarHoverDelays } from "../model/sidebar-context";

// Only a mouse hovers: a touch or a pen would expand the rail under the finger.
const isMouse = (event: PointerEvent) => event.pointerType === "mouse";

export const useHoverIntent = (dispatch: Dispatch<SidebarInteractionEvent>, delays: SidebarHoverDelays) => {
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  // A new enter or leave cancels the pending one, so crossing the rail fast never expands it.
  const schedule = (inside: boolean) => {
    window.clearTimeout(timer.current);
    const delay = inside ? delays.open : delays.close;
    timer.current = window.setTimeout(() => dispatch({ type: "pointer", inside }), delay);
  };
  return {
    onPointerEnter: (event: PointerEvent) => isMouse(event) && schedule(true),
    onPointerLeave: (event: PointerEvent) => isMouse(event) && schedule(false),
  };
};
