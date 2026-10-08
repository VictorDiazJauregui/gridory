import type { ReactElement } from "react";
import { Tooltip } from "radix-ui";
import { formatShortcut, isApplePlatform } from "../tools/shortcut-keys";
import type { MarkdownTool } from "../tools/tool-types";

interface ToolTooltipProps {
  tool: MarkdownTool;
  children: ReactElement;
}

export const ToolTooltip = ({ tool, children }: ToolTooltipProps) => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content side="bottom" sideOffset={6} className="gdy-scope gdy-md-tooltip">
        {tool.label}
        {tool.shortcut && <kbd className="gdy-md-tooltip-shortcut">{formatShortcut(tool.shortcut, isApplePlatform())}</kbd>}
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
);
