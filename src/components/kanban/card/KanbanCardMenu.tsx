import type { Ref } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { resolveMenuNodes, type ResolvedMenuNode } from "../../shared/menu/menu-nodes";
import { renderMenuNodes } from "../../shared/menu/render-menu-nodes";
import { stopPropagation } from "../../shared/stop-propagation";
import { resolveTriggerLabel } from "../../shared/menu/trigger-label";
import type { RowActionLabels } from "../../shared/menu/menu-nodes";
import type { KanbanBoardLabels, RowActions } from "../types";
import { buildMoveMenuNode, type CardMoveEntry } from "./move-menu-node";

interface KanbanCardMenuProps<TData> {
  card: TData;
  rowActions?: RowActions<TData>;
  labels: RowActionLabels & Pick<KanbanBoardLabels, "rowActionsTrigger">;
  /** "Move to", first in the menu; without it the menu is only the app's actions. */
  move?: CardMoveEntry;
}

const renderCardMenuTrigger = (label: string, ref?: Ref<HTMLButtonElement>) => (
  <button
    ref={ref}
    type="button"
    className="gdy-icon-btn"
    title={label}
    aria-label={label}
    onClick={stopPropagation}
  >
    <MoreHorizontal size={14} className="gdy-kanban-card-menu-icon" />
  </button>
);

const resolveCardMenuNodes = <TData,>(props: KanbanCardMenuProps<TData>): ResolvedMenuNode[] => {
  const { card, rowActions, labels, move } = props;
  const ownNodes = rowActions ? resolveMenuNodes({ row: card, actions: rowActions, labels }) : [];
  const moveNode = move ? buildMoveMenuNode(move) : null;
  return moveNode ? [moveNode, ...ownNodes] : ownNodes;
};

// The board finds the ⋯ button of a moved card through this ref, to give it the focus back.
const buildTriggerRef = (move?: CardMoveEntry) =>
  move ? (element: HTMLButtonElement | null) => move.moveMenu.feedback.registerTrigger(move.cardId, element) : undefined;

export const KanbanCardMenu = <TData,>(props: KanbanCardMenuProps<TData>) => {
  const nodes = resolveCardMenuNodes(props);
  if (nodes.length === 0) return null;
  const label = resolveTriggerLabel(props.rowActions, props.labels);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {renderCardMenuTrigger(label, buildTriggerRef(props.move))}
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={stopPropagation}>
        {renderMenuNodes(nodes)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
