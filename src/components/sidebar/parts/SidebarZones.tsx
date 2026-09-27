import { cn } from "../../../lib/cn";
import { useSidebarRegionName } from "../model/sidebar-region";
import type { SidebarZoneProps } from "../types";

export const SidebarHeader = ({ children, className }: SidebarZoneProps) => (
  <div className={cn("gdy-sidebar-header", className)}>{children}</div>
);

/** The only zone that scrolls: header and footer stay in place. */
export const SidebarContent = ({ children, className }: SidebarZoneProps) => (
  <nav className={cn("gdy-sidebar-content", className)} {...useSidebarRegionName()}>
    {children}
  </nav>
);

export const SidebarFooter = ({ children, className }: SidebarZoneProps) => (
  <div className={cn("gdy-sidebar-footer", className)}>{children}</div>
);
