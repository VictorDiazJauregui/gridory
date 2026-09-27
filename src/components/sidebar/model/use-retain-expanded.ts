import { useCallback } from "react";
import type { Dispatch } from "react";
import type { SidebarInteractionEvent } from "./interaction-state";

// Each retention is released once, however many times its release function runs.
export const useRetainExpanded = (dispatch: Dispatch<SidebarInteractionEvent>) =>
  useCallback(() => {
    let released = false;
    dispatch({ type: "retain" });
    return () => {
      if (released) return;
      released = true;
      dispatch({ type: "release" });
    };
  }, [dispatch]);
