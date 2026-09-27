import type { ReactElement } from "react";
import { Tooltip } from "radix-ui";

interface SidebarItemTooltipProps {
  label: string;
  children: ReactElement;
}

export const SidebarItemTooltip = ({ label, children }: SidebarItemTooltipProps) => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content side="right" sideOffset={8} className="gdy-scope gdy-sidebar-tooltip">
        {label}
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
);
