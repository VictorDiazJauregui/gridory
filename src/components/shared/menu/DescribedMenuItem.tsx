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

// Radix skips a `disabled` item on arrow keys, hiding its reason: a described item stays reachable with
// aria-disabled instead. Its name is the label alone; the description inside it is read once, as such.
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
