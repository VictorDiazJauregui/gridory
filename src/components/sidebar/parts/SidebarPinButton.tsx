import { PanelLeftClose, PanelLeftOpen, Pin, PinOff } from "lucide-react";
import { cn } from "../../../lib/cn";
import { useSidebarContext } from "../model/sidebar-context";
import type { SidebarContextValue } from "../model/sidebar-context";
import type { SidebarPinButtonProps } from "../types";

// With hover expansion it pins (a toggle); without it, it expands and collapses a region.
const resolvePinButtonView = ({ pinned, expandOnHover, texts }: SidebarContextValue) => {
  if (expandOnHover) {
    return { label: pinned ? texts.unpin : texts.pin, icon: pinned ? <PinOff /> : <Pin />, pressed: pinned, expanded: undefined };
  }
  const icon = pinned ? <PanelLeftClose /> : <PanelLeftOpen />;
  return { label: pinned ? texts.collapse : texts.expand, icon, pressed: undefined, expanded: pinned };
};

export const SidebarPinButton = ({ className }: SidebarPinButtonProps) => {
  const context = useSidebarContext("SidebarPinButton");
  if (context.isMobile) return null;
  const view = resolvePinButtonView(context);
  return (
    <button
      type="button"
      className={cn("gdy-sidebar-pin", className)}
      aria-label={view.label}
      aria-pressed={view.pressed}
      aria-expanded={view.expanded}
      onClick={() => context.setPinned(!context.pinned)}
    >
      {view.icon}
    </button>
  );
};
