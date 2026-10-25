import { resolveMenuNodes } from "../../shared/menu/menu-nodes";
import { renderMenuNodes } from "../../shared/menu/render-menu-nodes";
import { stopPropagation } from "../../shared/stop-propagation";
import { DropdownMenu, DropdownMenuContent } from "../../ui/dropdown-menu";
import { resolveTriggerLabel } from "../../shared/menu/trigger-label";
import { RowActionsTrigger } from "./RowActionsTrigger";
import type { ColumnAlign, RowActions } from "../types";

interface RowActionsMenuProps<TData> {
  row: TData;
  actions: RowActions<TData>;
  align?: ColumnAlign;
}

export const RowActionsMenu = <TData,>({
  row,
  actions,
  align,
}: RowActionsMenuProps<TData>) => {
  const nodes = resolveMenuNodes(row, actions);
  if (nodes.length === 0) return null;
  return (
    <div className="gdy-table-actions-cell" data-align={align} onClick={stopPropagation}>
      <DropdownMenu>
        <RowActionsTrigger label={resolveTriggerLabel(actions)} />
        <DropdownMenuContent onClick={stopPropagation}>
          {renderMenuNodes(nodes)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
