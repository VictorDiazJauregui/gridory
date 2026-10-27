import { FilterX } from "lucide-react";

interface ToolbarClearFiltersProps {
  label: string;
  onClear: () => void;
}

export const ToolbarClearFilters = ({ label, onClear }: ToolbarClearFiltersProps) => (
  <button
    type="button"
    className="gdy-btn gdy-btn-ghost gdy-toolbar-clear"
    onClick={onClear}
  >
    <span className="gdy-toolbar-clear-label">{label}</span>
    <FilterX size={12} className="gdy-toolbar-clear-icon" />
  </button>
);
