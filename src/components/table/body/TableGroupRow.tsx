import { GroupToggleButton } from "./GroupToggleButton";
import type { GroupHeader } from "../types";
import type { TableModelProps } from "../model/use-table-core";

interface TableGroupRowProps<TData> extends TableModelProps<TData> {
  header: GroupHeader;
}

export const TableGroupRow = <TData,>({
  header,
  model,
}: TableGroupRowProps<TData>) => {
  const { collapsedGroups, toggleGroup } = model.state;
  return (
    <tr className="gdy-table-group-row">
      <td className="gdy-table-group-cell" colSpan={model.table.options.columns.length}>
        <GroupToggleButton
          header={header}
          collapsed={collapsedGroups.has(header.value)}
          onToggle={toggleGroup}
        />
      </td>
    </tr>
  );
};
