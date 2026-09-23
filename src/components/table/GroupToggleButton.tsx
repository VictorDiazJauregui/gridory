import { ChevronDown } from "lucide-react";
import type { GroupHeader } from "./types";

interface GroupToggleButtonProps {
  header: GroupHeader;
  collapsed: boolean;
  onToggle: (value: string) => void;
}

export const GroupToggleButton = ({
  header,
  collapsed,
  onToggle,
}: GroupToggleButtonProps) => (
  <button
    type="button"
    className="gdy-table-group-toggle"
    onClick={() => onToggle(header.value)}
    aria-expanded={!collapsed}
  >
    <ChevronDown size={14} className="gdy-table-group-chevron" />
    <span className="gdy-table-group-label">{header.label}</span>
    <span className="gdy-table-group-count">{header.count}</span>
  </button>
);
