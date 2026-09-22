import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { renderMenuNodes, resolveMenuNodes } from "../shared/menu-actions";
import type { ReusableRowActions } from "./types";

const stopClick = (event: { stopPropagation: () => void }) =>
  event.stopPropagation();

export function RowActionsMenu<TData>({
  row,
  actions,
}: {
  row: TData;
  actions: ReusableRowActions<TData>;
}) {
  const nodes = resolveMenuNodes(row, actions);
  if (nodes.length === 0) return null;

  return (
    <div className="rdt-actions-cell" onClick={stopClick}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="rdt-icon-btn"
            title="Opciones"
            onClick={stopClick}
          >
            <MoreHorizontal size={14} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent onClick={stopClick}>
          {renderMenuNodes(nodes)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
