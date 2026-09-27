import { Tooltip } from "radix-ui";
import { cn } from "../../lib/cn";
import { SidebarContext } from "./model/sidebar-context";
import { useSidebarLayout } from "./model/use-sidebar-layout";
import type { SidebarLayoutProps } from "./types";
import "./styles.css";

export const SidebarLayout = (props: SidebarLayoutProps) => {
  const context = useSidebarLayout(props);
  return (
    <SidebarContext.Provider value={context}>
      <Tooltip.Provider delayDuration={0}>
        <div className={cn("gdy-sidebar-layout", props.className)} data-mobile={context.isMobile ? "true" : "false"}>
          {props.children}
        </div>
      </Tooltip.Provider>
    </SidebarContext.Provider>
  );
};
