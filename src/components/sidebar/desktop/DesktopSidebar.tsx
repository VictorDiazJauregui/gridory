import { cn } from "../../../lib/cn";
import { useSidebarContext } from "../model/sidebar-context";
import type { SidebarContextValue } from "../model/sidebar-context";
import type { SidebarProps } from "../types";
import { useHoverIntent } from "./use-hover-intent";
import { usePanelFocus } from "./use-panel-focus";

const toFlag = (value: boolean) => (value ? "true" : "false");

const buildRootAttributes = (context: SidebarContextValue) => ({
  "data-state": context.collapsed ? "collapsed" : "expanded",
  "data-pinned": toFlag(context.pinned),
  "data-hover-expand": toFlag(context.expandOnHover),
  "data-animated": toFlag(context.animated),
  "data-mobile": "false",
});

// The rail keeps its place in the page flow; the panel inside grows over the content.
export const DesktopSidebar = ({ children, className, classNames }: SidebarProps) => {
  const context = useSidebarContext("Sidebar");
  const hoverHandlers = useHoverIntent(context.dispatchInteraction, context.hoverDelays);
  const focusHandlers = usePanelFocus(context.dispatchInteraction);
  return (
    <div className={cn("gdy-scope gdy-sidebar", className, classNames?.root)} {...buildRootAttributes(context)}>
      <div className={cn("gdy-sidebar-panel", classNames?.panel)} {...hoverHandlers} {...focusHandlers}>
        {children}
      </div>
    </div>
  );
};
