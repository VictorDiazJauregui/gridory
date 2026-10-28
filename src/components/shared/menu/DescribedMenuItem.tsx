import { useId } from "react";
import { DropdownMenuItem } from "../../ui/dropdown-menu";
import type { ResolvedActionNode } from "./menu-nodes";

const stopEvent = (event: { stopPropagation: () => void }) => event.stopPropagation();

const preventSelect = (event: Event) => event.preventDefault();

const resolveSelectState = (node: ResolvedActionNode) => ({
  "aria-disabled": node.disabled || undefined,
  "data-disabled": node.disabled ? "" : undefined,
  onSelect: node.disabled ? preventSelect : node.onSelect,
});

// Radix skips a `disabled` item on the arrow keys, so a screen reader would never reach the reason. An
// item with a description stays reachable instead, marked with aria-disabled and kept from selecting.
// Its name is the label alone: the description sits inside the item but is read once, as description.
export const DescribedMenuItem = ({ node }: { node: ResolvedActionNode }) => {
  const labelId = useId();
  const descriptionId = useId();
  return (
    <DropdownMenuItem
      variant={node.variant}
      {...resolveSelectState(node)}
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      onClick={stopEvent}
    >
      {node.icon}
      <span className="gdy-menu-item-label">
        <span id={labelId}>{node.label}</span>
        <span id={descriptionId} className="gdy-menu-item-description">{node.description}</span>
      </span>
    </DropdownMenuItem>
  );
};
