import { cn } from "../../../lib/cn";
import type { SidebarLogoProps } from "../types";

// Both layers stay mounted and cross by opacity, so the header never changes height.
export const SidebarLogo = ({ full, compact, className }: SidebarLogoProps) => (
  <div className={cn("gdy-sidebar-logo", className)} data-compact={compact ? "true" : "false"}>
    <span className="gdy-sidebar-logo-full">{full}</span>
    {compact ? (
      <span className="gdy-sidebar-logo-compact" aria-hidden="true">
        {compact}
      </span>
    ) : null}
  </div>
);
