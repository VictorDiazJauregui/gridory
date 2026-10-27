import { resolveMenuNodes } from "../../shared/menu/menu-nodes";
import { renderMenuNodes } from "../../shared/menu/render-menu-nodes";
import { stopPropagation } from "../../shared/stop-propagation";
import { DropdownMenu, DropdownMenuContent } from "../../ui/dropdown-menu";
import { resolveTriggerLabel } from "../../shared/menu/trigger-label";
import { RowActionsTrigger } from "./RowActionsTrigger";
import type { RowActionLabels } from "../../shared/menu/menu-nodes";
import type { ColumnAlign, DataTableLabels, RowActions } from "../types";

interface RowActionsMenuProps<TData> {
  row: TData;
  actions: RowActions<TData>;
  align?: ColumnAlign;
  labels: RowActionLabels & Pick<DataTableLabels, "rowActionsTrigger">;
}

export const RowActionsMenu = <TData,>({
  row,
  actions,
  align,
  labels,
}: RowActionsMenuProps<TData>) => {
  const nodes = resolveMenuNodes({ row, actions, labels });
  if (nodes.length === 0) return null;
  return (
    <div className="gdy-table-actions-cell" data-align={align} onClick={stopPropagation}>
      <DropdownMenu>
        <RowActionsTrigger label={resolveTriggerLabel(actions, labels)} />
        <DropdownMenuContent onClick={stopPropagation}>
          {renderMenuNodes(nodes)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
