import type { Header } from "@tanstack/react-table";
import { TableColumnFilterMenu } from "./TableColumnFilterMenu";
import { TableHeaderTrigger } from "./TableHeaderTrigger";
import type { TableModelProps } from "../model/use-table-core";

interface TableHeaderCellProps<TData> extends TableModelProps<TData> {
  header: Header<TData, unknown>;
}

export const TableHeaderCell = <TData,>({
  header,
  model,
}: TableHeaderCellProps<TData>) => {
  const { settings, state } = model;
  const column = settings.columns.find((item) => item.id === header.column.id);
  if (!column) return <th className="gdy-table-head-cell" />;
  const isMenuOpen =
    state.openFilterColumnId === column.id &&
    settings.flags.filtering &&
    Boolean(column.filterable);
  return (
    <th className="gdy-table-head-cell" style={{ width: column.width }}>
      <div className="gdy-table-head-inner">
        <TableHeaderTrigger column={column} model={model} />
        {isMenuOpen && <TableColumnFilterMenu column={column} model={model} />}
      </div>
    </th>
  );
};
