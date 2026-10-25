import { Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { DropdownMenu as MenuPrimitive } from "radix-ui";
import { DropdownMenuItem, DropdownMenuSeparator } from "../../ui/dropdown-menu";
import { formatShortcut, isApplePlatform } from "../tools/shortcut-keys";
import type { MarkdownTool, ToolRunContext } from "../tools/tool-types";

interface OverflowToolItemProps {
  tool: MarkdownTool;
  context: ToolRunContext;
  onChoose: (action: () => void) => void;
}

const OverflowSubmenu = ({ tool, context, onChoose }: OverflowToolItemProps) => (
  <MenuPrimitive.Sub>
    <MenuPrimitive.SubTrigger className="gdy-menu-item">
      <tool.icon aria-hidden />
      {tool.label}
      <ChevronRight className="gdy-md-menu-submenu-icon" aria-hidden />
    </MenuPrimitive.SubTrigger>
    <MenuPrimitive.Portal>
      <MenuPrimitive.SubContent className="gdy-scope gdy-menu-content" sideOffset={4}>
        {tool.items?.map((item) => (
          <DropdownMenuItem key={item.id} className={item.className} onSelect={() => onChoose(() => item.run(context))}>
            {item.icon && <item.icon aria-hidden />}
            {item.label}
            {item.shortcut && <span className="gdy-md-menu-shortcut">{formatShortcut(item.shortcut, isApplePlatform())}</span>}
          </DropdownMenuItem>
        ))}
      </MenuPrimitive.SubContent>
    </MenuPrimitive.Portal>
  </MenuPrimitive.Sub>
);

const OverflowToolItem = ({ tool, context, onChoose }: OverflowToolItemProps) => {
  if (tool.items) return <OverflowSubmenu tool={tool} context={context} onChoose={onChoose} />;
  return (
    <DropdownMenuItem disabled={tool.isDisabled?.(context) ?? false} onSelect={() => onChoose(() => tool.run?.(context))}>
      <tool.icon aria-hidden />
      {tool.label}
      {tool.shortcut && <span className="gdy-md-menu-shortcut">{formatShortcut(tool.shortcut, isApplePlatform())}</span>}
    </DropdownMenuItem>
  );
};

interface OverflowToolItemsProps {
  groups: MarkdownTool[][];
  context: ToolRunContext;
  onChoose: (action: () => void) => void;
}

export const OverflowToolItems = ({ groups, context, onChoose }: OverflowToolItemsProps) =>
  groups.map((group, index) => (
    <Fragment key={group[0].id}>
      {index > 0 && <DropdownMenuSeparator />}
      {group.map((tool) => <OverflowToolItem key={tool.id} tool={tool} context={context} onChoose={onChoose} />)}
    </Fragment>
  ));
