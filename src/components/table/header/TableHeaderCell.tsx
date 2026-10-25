import type { Header } from "@tanstack/react-table";
import { cn } from "../../../lib/cn";
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

interface ActionsHeaderCellProps {
  label?: string;
  className: string;
  attributes: object;
}

// The actions column has no definition of its own: an optional label and no trigger.
const ActionsHeaderCell = ({ label, className, attributes }: ActionsHeaderCellProps) => (
  <th className={className} {...attributes}>
    {label ? <span className="gdy-table-actions-head-label">{label}</span> : null}
  </th>
);

export const TableHeaderCell = <TData,>({
  header,
  model,
}: TableHeaderCellProps<TData>) => {
  const align = readColumnAlignment(header.column.columnDef).header;
  const cellAttributes = buildCellAttributes(header.column.id, align);
  const className = cn("gdy-table-head-cell", model.settings.classNames?.headCell);
  const column = model.settings.columns.find((item) => item.id === header.column.id);
  if (!column) {
    return <ActionsHeaderCell label={model.settings.rowActions?.columnLabel} className={className} attributes={cellAttributes} />;
  }
  return (
    <th className={className} style={{ width: column.width }} {...cellAttributes}>
      <div className="gdy-table-head-inner">
        <TableHeaderTrigger column={column} model={model} align={align} />
        {isFilterMenuOpen({ column, model }) && <TableColumnFilterMenu column={column} model={model} />}
      </div>
    </th>
  );
};
