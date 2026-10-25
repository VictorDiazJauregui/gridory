import type { Header } from "@tanstack/react-table";
import { buildCellAttributes, readColumnAlignment } from "../model/cell-attributes";
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

// The actions column has no definition of its own: an optional label and no trigger.
const ActionsHeaderCell = ({ label, attributes }: { label?: string; attributes: object }) => (
  <th className="gdy-table-head-cell" {...attributes}>
    {label ? <span className="gdy-table-actions-head-label">{label}</span> : null}
  </th>
);

export const TableHeaderCell = <TData,>({
  header,
  model,
}: TableHeaderCellProps<TData>) => {
  const align = readColumnAlignment(header.column.columnDef).header;
  const cellAttributes = buildCellAttributes(header.column.id, align);
  const column = model.settings.columns.find((item) => item.id === header.column.id);
  if (!column) {
    return <ActionsHeaderCell label={model.settings.rowActions?.columnLabel} attributes={cellAttributes} />;
  }
  return (
    <th className="gdy-table-head-cell" style={{ width: column.width }} {...cellAttributes}>
      <div className="gdy-table-head-inner">
        <TableHeaderTrigger column={column} model={model} align={align} />
        {isFilterMenuOpen({ column, model }) && <TableColumnFilterMenu column={column} model={model} />}
      </div>
    </th>
  );
};
