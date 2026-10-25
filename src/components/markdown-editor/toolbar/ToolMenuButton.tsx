import { ChevronDown } from "lucide-react";
import { DropdownMenu as MenuPrimitive, Toolbar } from "radix-ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "../../ui/dropdown-menu";
import { formatShortcut, isApplePlatform } from "../tools/shortcut-keys";
import type { MarkdownTool, ToolRunContext } from "../tools/tool-types";
import { ToolTooltip } from "./ToolTooltip";
import { useDeferredCloseAction } from "../model/use-deferred-close-action";

interface ToolMenuButtonProps {
  tool: MarkdownTool;
  context: ToolRunContext;
}

const ToolMenuTrigger = ({ tool, context }: ToolMenuButtonProps) => (
  <ToolTooltip tool={tool}>
    <MenuPrimitive.Trigger asChild>
      <Toolbar.Button className="gdy-md-tool" data-menu="" aria-label={tool.label} disabled={tool.isDisabled?.(context) ?? false}>
        <tool.icon className="gdy-md-tool-icon" aria-hidden />
        <ChevronDown className="gdy-md-tool-chevron" aria-hidden />
      </Toolbar.Button>
    </MenuPrimitive.Trigger>
  </ToolTooltip>
);

export const ToolMenuButton = ({ tool, context }: ToolMenuButtonProps) => {
  const deferredAction = useDeferredCloseAction();
  return (
    <DropdownMenu>
      <ToolMenuTrigger tool={tool} context={context} />
      <DropdownMenuContent align="start" onCloseAutoFocus={deferredAction.onCloseAutoFocus}>
        {tool.items?.map((item) => (
          <DropdownMenuItem key={item.id} className={item.className} onSelect={() => deferredAction.runAfterClose(() => item.run(context))}>
            {item.icon && <item.icon aria-hidden />}
            {item.label}
            {item.shortcut && <span className="gdy-md-menu-shortcut">{formatShortcut(item.shortcut, isApplePlatform())}</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
