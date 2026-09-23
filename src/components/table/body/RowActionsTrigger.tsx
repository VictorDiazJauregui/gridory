import { MoreHorizontal } from "lucide-react";
import { stopPropagation } from "../../shared/stop-propagation";
import { DropdownMenuTrigger } from "../../ui/dropdown-menu";

export const RowActionsTrigger = () => (
  <DropdownMenuTrigger asChild>
    <button
      type="button"
      className="gdy-icon-btn"
      title="Opciones"
      onClick={stopPropagation}
    >
      <MoreHorizontal size={14} className="gdy-table-actions-icon" />
    </button>
  </DropdownMenuTrigger>
);
