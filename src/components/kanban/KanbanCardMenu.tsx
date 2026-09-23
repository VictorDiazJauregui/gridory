import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { renderMenuNodes, resolveMenuNodes } from "../shared/menu-actions";
import { stopPropagation } from "../shared/stop-propagation";
import type { RowActions } from "./types";

interface KanbanCardMenuProps<TData> {
  card: TData;
  rowActions?: RowActions<TData>;
}

const renderCardMenuTrigger = () => (
  <button
    type="button"
    className="gdy-icon-btn"
    title="Opciones"
    aria-label="Opciones"
    onClick={stopPropagation}
  >
    <MoreHorizontal size={14} className="gdy-kanban-card-menu-icon" />
  </button>
);

export const KanbanCardMenu = <TData,>(props: KanbanCardMenuProps<TData>) => {
  if (!props.rowActions) return null;
  const nodes = resolveMenuNodes(props.card, props.rowActions);
  if (nodes.length === 0) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderCardMenuTrigger()}
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={stopPropagation}>
        {renderMenuNodes(nodes)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
