import type { ReactNode } from "react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import type { ResolvedActionNode, ResolvedMenuNode } from "./menu-nodes";

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

const renderMenuNode = (node: ResolvedMenuNode) => {
  if (node.type === "separator")
    return <DropdownMenuSeparator key={node.key} />;
  if (node.type === "label")
    return (
      <DropdownMenuLabel key={node.key} className={node.className}>
        {node.label}
      </DropdownMenuLabel>
    );
  return renderActionNode(node);
};

export const renderMenuNodes = (nodes: ResolvedMenuNode[]): ReactNode =>
  nodes.map(renderMenuNode);
