import { cn } from "../../../lib/cn";
import type { SidebarSeparatorProps } from "../types";

export const SidebarSeparator = ({ className }: SidebarSeparatorProps) => (
  <div role="separator" className={cn("gdy-sidebar-separator", className)} />
);
