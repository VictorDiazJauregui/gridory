import { MoreHorizontal } from "lucide-react";
import { Toolbar } from "radix-ui";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import type { MarkdownTool, ToolRunContext } from "../tools/tool-types";
import { OverflowToolItems } from "./OverflowToolItems";
import { useDeferredCloseAction } from "../model/use-deferred-close-action";

interface ToolbarOverflowMenuProps {
  groups: MarkdownTool[][];
  context: ToolRunContext;
  label: string;
}

export const ToolbarOverflowMenu = ({ groups, context, label }: ToolbarOverflowMenuProps) => {
  const deferredAction = useDeferredCloseAction();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Toolbar.Button className="gdy-md-tool gdy-md-toolbar-more" aria-label={label} title={label}>
          <MoreHorizontal className="gdy-md-tool-icon" aria-hidden />
        </Toolbar.Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="gdy-md-overflow-menu" onCloseAutoFocus={deferredAction.onCloseAutoFocus}>
        <OverflowToolItems groups={groups} context={context} onChoose={deferredAction.runAfterClose} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
