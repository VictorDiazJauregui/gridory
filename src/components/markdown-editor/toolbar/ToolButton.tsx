import { Toolbar } from "radix-ui";
import type { MarkdownTool, ToolRunContext } from "../tools/tool-types";
import { ToolMenuButton } from "./ToolMenuButton";
import { ToolTooltip } from "./ToolTooltip";

interface ToolButtonProps {
  tool: MarkdownTool;
  context: ToolRunContext;
}

export const ToolButton = ({ tool, context }: ToolButtonProps) => {
  if (tool.items) return <ToolMenuButton tool={tool} context={context} />;
  const Icon = tool.icon;
  return (
    <ToolTooltip tool={tool}>
      <Toolbar.Button
        className="gdy-md-tool"
        aria-label={tool.label}
        disabled={tool.isDisabled?.(context) ?? false}
        aria-pressed={tool.isActive?.(context)}
        onClick={() => tool.run?.(context)}
      >
        <Icon className="gdy-md-tool-icon" aria-hidden />
      </Toolbar.Button>
    </ToolTooltip>
  );
};
