import { FilterX } from "lucide-react";

interface ToolbarClearFiltersProps {
  onClear: () => void;
}

export const ToolbarClearFilters = ({ onClear }: ToolbarClearFiltersProps) => (
  <button
    type="button"
    className="gdy-btn gdy-btn-ghost gdy-toolbar-clear"
    onClick={onClear}
  >
    <span className="gdy-toolbar-clear-label">Limpiar filtros</span>
    <FilterX size={12} className="gdy-toolbar-clear-icon" />
  </button>
);
