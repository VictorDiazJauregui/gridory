import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { resolveMenuNodes } from "../../shared/menu/menu-nodes";
import { renderMenuNodes } from "../../shared/menu/render-menu-nodes";
import { stopPropagation } from "../../shared/stop-propagation";
import { resolveTriggerLabel } from "../../shared/menu/trigger-label";
import type { RowActionLabels } from "../../shared/menu/menu-nodes";
import type { KanbanBoardLabels, RowActions } from "../types";

interface KanbanCardMenuProps<TData> {
  card: TData;
  rowActions?: RowActions<TData>;
  labels: RowActionLabels & Pick<KanbanBoardLabels, "rowActionsTrigger">;
}

const renderCardMenuTrigger = (label: string) => (
  <button
    type="button"
    className="gdy-icon-btn"
    title={label}
    aria-label={label}
    onClick={stopPropagation}
  >
    <MoreHorizontal size={14} className="gdy-kanban-card-menu-icon" />
  </button>
);

export const KanbanCardMenu = <TData,>(props: KanbanCardMenuProps<TData>) => {
  if (!props.rowActions) return null;
  const nodes = resolveMenuNodes({ row: props.card, actions: props.rowActions, labels: props.labels });
  if (nodes.length === 0) return null;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderCardMenuTrigger(resolveTriggerLabel(props.rowActions, props.labels))}
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={stopPropagation}>
        {renderMenuNodes(nodes)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
