import { useReducer, useState } from "react";
import { DEFAULT_SIDEBAR_TEXTS, SIDEBAR_DEFAULTS } from "../constants";
import type { SidebarLayoutProps } from "../types";
import { INITIAL_INTERACTION, reduceInteraction, resolveExpanded } from "./interaction-state";
import type { SidebarContextValue } from "./sidebar-context";
import { useMediaQuery } from "./use-media-query";
import { usePinnedState } from "./use-pinned-state";
import { useRetainExpanded } from "./use-retain-expanded";

const resolveSettings = (props: SidebarLayoutProps) => ({
  expandOnHover: props.expandOnHover ?? SIDEBAR_DEFAULTS.expandOnHover,
  animated: props.animated ?? SIDEBAR_DEFAULTS.animated,
  texts: { ...DEFAULT_SIDEBAR_TEXTS, ...props.texts },
  hoverDelays: {
    open: props.hoverOpenDelay ?? SIDEBAR_DEFAULTS.hoverOpenDelay,
    close: props.hoverCloseDelay ?? SIDEBAR_DEFAULTS.hoverCloseDelay,
  },
});

const useIsMobile = (breakpoint: number = SIDEBAR_DEFAULTS.mobileBreakpoint) =>
  useMediaQuery(`(max-width: ${breakpoint - 0.02}px)`);

export const useSidebarLayout = (props: SidebarLayoutProps): SidebarContextValue => {
  const settings = resolveSettings(props);
  const { pinned, setPinned } = usePinnedState(props);
  const [interaction, dispatchInteraction] = useReducer(reduceInteraction, INITIAL_INTERACTION);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile(props.mobileBreakpoint);
  const expanded = resolveExpanded({ pinned, expandOnHover: settings.expandOnHover, interaction });
  return {
    ...settings,
    collapsed: !isMobile && !expanded,
    pinned,
    isMobile,
    setPinned,
    retainExpanded: useRetainExpanded(dispatchInteraction),
    dispatchInteraction,
    mobileMenu: { open: mobileMenuOpen, setOpen: setMobileMenuOpen },
  };
};
