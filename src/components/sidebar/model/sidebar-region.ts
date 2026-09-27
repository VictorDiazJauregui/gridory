import { createContext, useContext } from "react";
import type { SidebarProps } from "../types";

export interface SidebarRegionName {
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

// The Sidebar owns the name; SidebarContent, where the navigation lives, carries it.
export const SidebarRegionContext = createContext<SidebarRegionName>({});

export const pickRegionName = (props: SidebarProps): SidebarRegionName => ({
  "aria-label": props["aria-label"],
  "aria-labelledby": props["aria-labelledby"],
});

export const useSidebarRegionName = () => useContext(SidebarRegionContext);
