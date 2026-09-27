import { createContext, useContext } from "react";
import type { Dispatch } from "react";
import type { SidebarState, SidebarTexts } from "../types";
import type { SidebarInteractionEvent } from "./interaction-state";

export interface SidebarHoverDelays {
  open: number;
  close: number;
}

export interface SidebarMobileMenu {
  open: boolean;
  setOpen: (open: boolean) => void;
}

/** Everything the parts share; `useSidebar()` exposes only the public `SidebarState`. */
export interface SidebarContextValue extends SidebarState {
  animated: boolean;
  texts: SidebarTexts;
  hoverDelays: SidebarHoverDelays;
  dispatchInteraction: Dispatch<SidebarInteractionEvent>;
  mobileMenu: SidebarMobileMenu;
}

export class MissingSidebarLayoutError extends Error {
  constructor(consumer: string) {
    super(`${consumer} must be rendered inside <SidebarLayout>`);
    this.name = "MissingSidebarLayoutError";
  }
}

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export const useSidebarContext = (consumer: string): SidebarContextValue => {
  const context = useContext(SidebarContext);
  if (!context) throw new MissingSidebarLayoutError(consumer);
  return context;
};

export const useSidebar = (): SidebarState => {
  const { collapsed, pinned, isMobile, expandOnHover, setPinned, retainExpanded } = useSidebarContext("useSidebar()");
  return { collapsed, pinned, isMobile, expandOnHover, setPinned, retainExpanded };
};
