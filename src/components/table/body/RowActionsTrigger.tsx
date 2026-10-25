import { MoreHorizontal } from "lucide-react";
import { stopPropagation } from "../../shared/stop-propagation";
import { DropdownMenuTrigger } from "../../ui/dropdown-menu";

export const RowActionsTrigger = ({ label }: { label: string }) => (
  <DropdownMenuTrigger asChild>
    <button
      type="button"
      className="gdy-icon-btn"
      title={label}
      aria-label={label}
      onClick={stopPropagation}
    >
      <MoreHorizontal size={14} className="gdy-table-actions-icon" />
    </button>
  </DropdownMenuTrigger>
);
