import { Fragment, useRef } from "react";
import { Toolbar, Tooltip } from "radix-ui";
import { cn } from "../../../lib/cn";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import type { MarkdownTool, ToolRunContext } from "../tools/tool-types";
import { ToolbarMeasureRow } from "./ToolbarMeasureRow";
import { ToolbarOverflowMenu } from "./ToolbarOverflowMenu";
import { ToolButton } from "./ToolButton";
import { useFittingGroups } from "./use-fitting-groups";

export interface MarkdownToolbarProps {
  className?: string;
}

interface VisibleGroupsProps {
  groups: MarkdownTool[][];
  context: ToolRunContext;
}

const VisibleGroups = ({ groups, context }: VisibleGroupsProps) =>
  groups.map((group, index) => (
    <Fragment key={group[0].id}>
      {index > 0 && <Toolbar.Separator className="gdy-md-toolbar-separator" />}
      {group.map((tool) => <ToolButton key={tool.id} tool={tool} context={context} />)}
    </Fragment>
  ));

export const MarkdownToolbar = ({ className }: MarkdownToolbarProps) => {
  const { toolGroups, editorState, texts } = useMarkdownEditorContext("MarkdownToolbar");
  const toolbarRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const visibleCount = useFittingGroups(toolbarRef, measureRef, toolGroups.length);
  const context = { editor: editorState };
  return (
    <Tooltip.Provider delayDuration={400}>
      <Toolbar.Root ref={toolbarRef} className={cn("gdy-scope gdy-md-toolbar", className)} aria-label={texts.toolbarLabel}>
        <ToolbarMeasureRow ref={measureRef} groups={toolGroups} />
        <VisibleGroups groups={toolGroups.slice(0, visibleCount)} context={context} />
        {visibleCount < toolGroups.length && (
          <ToolbarOverflowMenu groups={toolGroups.slice(visibleCount)} context={context} label={texts.moreTools} />
        )}
      </Toolbar.Root>
    </Tooltip.Provider>
  );
};
