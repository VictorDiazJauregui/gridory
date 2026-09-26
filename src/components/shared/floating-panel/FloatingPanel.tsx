import type { CSSProperties, ReactNode } from "react";

import { cn } from "../../../lib/cn";
import { Popover, PopoverAnchor, PopoverContent, PopoverTrigger } from "../../ui/popover";
import type { AccessibleName } from "../accessible-name";
import { closeOnTab } from "./close-on-tab";
import { FloatingPanelCloseContext, useCloseFloatingPanel } from "./floating-panel-context";
import { FLOATING_PANEL_PLACEMENT } from "./floating-panel-placement";

interface FloatingPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

interface FloatingPanelSlotProps {
  children: ReactNode;
}

type FloatingPanelContentProps = AccessibleName & {
  children: ReactNode;
  portalContainer?: HTMLElement | null;
  className?: string;
  style?: CSSProperties;
};

export const FloatingPanel = ({ open, onOpenChange, children }: FloatingPanelProps) => (
  <FloatingPanelCloseContext.Provider value={() => onOpenChange(false)}>
    <Popover open={open} onOpenChange={onOpenChange} modal={false}>
      {children}
    </Popover>
  </FloatingPanelCloseContext.Provider>
);

export const FloatingPanelAnchor = ({ children }: FloatingPanelSlotProps) => (
  <PopoverAnchor asChild>{children}</PopoverAnchor>
);

export const FloatingPanelTrigger = ({ children }: FloatingPanelSlotProps) => (
  <PopoverTrigger asChild>{children}</PopoverTrigger>
);

export const FloatingPanelContent = ({
  portalContainer,
  className,
  ...contentProps
}: FloatingPanelContentProps) => {
  const closePanel = useCloseFloatingPanel();
  return (
    <PopoverContent
      {...FLOATING_PANEL_PLACEMENT}
      {...contentProps}
      container={portalContainer}
      className={cn("gdy-floating-panel gdy-thin-scroll", className)}
      onKeyDown={(event) => closeOnTab(event, closePanel)}
    />
  );
};
