import { resolveMenuNodes } from "../../shared/menu/menu-nodes";
import { renderMenuNodes } from "../../shared/menu/render-menu-nodes";
import { stopPropagation } from "../../shared/stop-propagation";
import { DropdownMenu, DropdownMenuContent } from "../../ui/dropdown-menu";
import { RowActionsTrigger } from "./RowActionsTrigger";
import type { RowActions } from "../types";

interface RowActionsMenuProps<TData> {
  row: TData;
  actions: RowActions<TData>;
}

export const RowActionsMenu = <TData,>({
  row,
  actions,
}: RowActionsMenuProps<TData>) => {
  const nodes = resolveMenuNodes(row, actions);
  if (nodes.length === 0) return null;
  return (
    <div className="gdy-table-actions-cell" onClick={stopPropagation}>
      <DropdownMenu>
        <RowActionsTrigger />
        <DropdownMenuContent onClick={stopPropagation}>
          {renderMenuNodes(nodes)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
