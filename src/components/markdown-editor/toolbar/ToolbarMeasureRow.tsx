import { forwardRef } from "react";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import type { MarkdownTool } from "../tools/tool-types";

interface ToolbarMeasureRowProps {
  groups: MarkdownTool[][];
}

const MeasuredTool = ({ tool }: { tool: MarkdownTool }) => (
  <span className="gdy-md-tool" data-menu={tool.items ? "" : undefined}>
    <tool.icon className="gdy-md-tool-icon" aria-hidden />
    {tool.items && <ChevronDown className="gdy-md-tool-chevron" aria-hidden />}
  </span>
);

export const ToolbarMeasureRow = forwardRef<HTMLDivElement, ToolbarMeasureRowProps>(({ groups }, ref) => (
  <div ref={ref} className="gdy-md-toolbar-measure" aria-hidden>
    {groups.map((group, index) => (
      <span key={group[0].id} className="gdy-md-toolbar-group" data-measure-group="">
        {index > 0 && <span className="gdy-md-toolbar-separator" />}
        {group.map((tool) => <MeasuredTool key={tool.id} tool={tool} />)}
      </span>
    ))}
    <span className="gdy-md-tool" data-measure-overflow="">
      <MoreHorizontal className="gdy-md-tool-icon" aria-hidden />
    </span>
  </div>
));
