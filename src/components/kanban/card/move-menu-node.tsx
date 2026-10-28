import { ArrowRightLeft } from "lucide-react";
import type { ResolvedActionNode, ResolvedSubmenuNode } from "../../shared/menu/menu-nodes";
import type { MoveMenuState } from "../model/use-move-menu";
import type { FilterOption } from "../types";

/** What a card needs to offer "Move to": the board's move menu and where the card is now. */
export interface CardMoveEntry {
  moveMenu: MoveMenuState;
  cardId: string;
  groupValue: string;
  pending: boolean;
  label: string;
}

// Not one of the reserved row action ids: an app's own "move" action keeps working.
const MOVE_MENU_KEY = "kanban:move-to";

const toDestinationNode = (entry: CardMoveEntry, column: FilterOption): ResolvedActionNode => {
  const { moveMenu, cardId } = entry;
  const allowed = moveMenu.isDropAllowed(cardId, column.value);
  return {
    type: "action",
    key: `${MOVE_MENU_KEY}:${column.value}`,
    icon: null,
    label: column.label,
    disabled: !allowed,
    description: allowed ? undefined : moveMenu.getRejectionReason(cardId, column.value),
    onSelect: () => moveMenu.moveFromMenu(cardId, column.value),
  };
};

export const buildMoveMenuNode = (entry: CardMoveEntry): ResolvedSubmenuNode | null => {
  const destinations = entry.moveMenu.columns.filter((column) => column.value !== entry.groupValue);
  if (destinations.length === 0) return null;
  return {
    type: "submenu",
    key: MOVE_MENU_KEY,
    icon: <ArrowRightLeft />,
    label: entry.label,
    disabled: entry.pending,
    children: destinations.map((column) => toDestinationNode(entry, column)),
  };
};
