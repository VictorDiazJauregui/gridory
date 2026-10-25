import type { Header } from "@tanstack/react-table";
import { buildCellAttributes } from "../model/cell-attributes";
import { TableColumnFilterMenu } from "./TableColumnFilterMenu";
import { TableHeaderTrigger } from "./TableHeaderTrigger";
import type { TableColumnProps, TableModelProps } from "../model/use-table-core";

interface TableHeaderCellProps<TData> extends TableModelProps<TData> {
  header: Header<TData, unknown>;
}

const isFilterMenuOpen = <TData,>({ column, model }: TableColumnProps<TData>) =>
  model.state.openFilterColumnId === column.id &&
  model.settings.flags.filtering &&
  Boolean(column.filterable);

export const TableHeaderCell = <TData,>({
  header,
  model,
}: TableHeaderCellProps<TData>) => {
  const cellAttributes = buildCellAttributes(header.column.id);
  const column = model.settings.columns.find((item) => item.id === header.column.id);
  if (!column) return <th className="gdy-table-head-cell" {...cellAttributes} />;
  return (
    <th className="gdy-table-head-cell" style={{ width: column.width }} {...cellAttributes}>
      <div className="gdy-table-head-inner">
        <TableHeaderTrigger column={column} model={model} />
        {isFilterMenuOpen({ column, model }) && <TableColumnFilterMenu column={column} model={model} />}
      </div>
    </th>
  );
};
