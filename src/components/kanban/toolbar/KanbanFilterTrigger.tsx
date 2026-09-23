import { ChevronDown, Filter } from "lucide-react";

interface KanbanFilterTriggerProps {
  label: string;
  hasFilter: boolean;
  onToggle: () => void;
}

export const KanbanFilterTrigger = ({
  label,
  hasFilter,
  onToggle,
}: KanbanFilterTriggerProps) => (
  <button
    type="button"
    className="gdy-kanban-filter-trigger"
    data-filtered={hasFilter || undefined}
    onClick={onToggle}
  >
    <span className="gdy-kanban-filter-trigger-label" title={label}>
      {label}
    </span>
    {hasFilter ? <Filter size={12} className="gdy-kanban-filter-icon" /> : null}
    <ChevronDown size={13} className="gdy-kanban-filter-arrow" />
  </button>
);
