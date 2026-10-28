import type { ReactNode } from "react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "../../ui/dropdown-menu";
import type { ResolvedActionNode, ResolvedMenuNode, ResolvedSubmenuNode } from "./menu-nodes";

const stopEvent = (event: { stopPropagation: () => void }) =>
  event.stopPropagation();

const renderActionNode = (node: ResolvedActionNode) => (
  <DropdownMenuItem
    key={node.key}
    variant={node.variant}
    disabled={node.disabled}
    onSelect={node.onSelect}
    onClick={stopEvent}
  >
    {node.icon}
    <span className="gdy-menu-item-label">{node.label}</span>
  </DropdownMenuItem>
);

const renderSubmenuNode = (node: ResolvedSubmenuNode) => (
  <DropdownMenuSub key={node.key}>
    <DropdownMenuSubTrigger disabled={node.disabled} onClick={stopEvent}>
      {node.icon}
      <span className="gdy-menu-item-label">{node.label}</span>
    </DropdownMenuSubTrigger>
    <DropdownMenuSubContent>{node.children.map(renderActionNode)}</DropdownMenuSubContent>
  </DropdownMenuSub>
);

const renderMenuNode = (node: ResolvedMenuNode) => {
  if (node.type === "separator")
    return <DropdownMenuSeparator key={node.key} />;
  if (node.type === "label")
    return (
      <DropdownMenuLabel key={node.key} className={node.className}>
        {node.label}
      </DropdownMenuLabel>
    );
  if (node.type === "submenu") return renderSubmenuNode(node);
  return renderActionNode(node);
};

export const renderMenuNodes = (nodes: ResolvedMenuNode[]): ReactNode =>
  nodes.map(renderMenuNode);
