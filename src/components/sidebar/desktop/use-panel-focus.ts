import { useRef } from "react";
import type { Dispatch, FocusEvent, KeyboardEvent } from "react";
import type { SidebarInteractionEvent } from "../model/interaction-state";

// A click also focuses what it hits; only keyboard focus should expand the rail,
// or the sidebar would stay open after the pointer leaves a clicked item.
export const usePanelFocus = (dispatch: Dispatch<SidebarInteractionEvent>) => {
  const focusFromPointer = useRef(false);
  const onFocus = () => {
    if (focusFromPointer.current) return;
    dispatch({ type: "focus", inside: true });
  };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    dispatch({ type: "focus", inside: false });
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") dispatch({ type: "dismiss" });
  };
  const onPointerDown = () => (focusFromPointer.current = true);
  const onPointerUp = () => (focusFromPointer.current = false);
  return { onFocus, onBlur, onKeyDown, onPointerDown, onPointerUp };
};
