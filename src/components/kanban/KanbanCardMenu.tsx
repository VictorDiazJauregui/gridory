import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { renderMenuNodes, resolveMenuNodes } from "../shared/menu-actions";
import type { RowActions } from "./types";

const stopClick = (event: { stopPropagation: () => void }) =>
  event.stopPropagation();

interface KanbanCardMenuProps<TData> {
  card: TData;
  rowActions?: RowActions<TData>;
}

export const KanbanCardMenu = <TData,>({
  card,
  rowActions,
}: KanbanCardMenuProps<TData>) => {
  if (!rowActions) return null;
  const nodes = resolveMenuNodes(card, rowActions);
  if (nodes.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rkb-icon-btn"
          title="Opciones"
          aria-label="Opciones"
          onClick={stopClick}
        >
          <MoreHorizontal size={14} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={stopClick}>
        {renderMenuNodes(nodes)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
