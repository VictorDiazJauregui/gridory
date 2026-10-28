import type { Header } from "@tanstack/react-table";
import { cn } from "../../../lib/cn";
import { SELECT_COLUMN_ID } from "../columns/internal-columns";
import { SelectHeaderContent } from "../selection/RowSelectCell";
import { buildCellAttributes, readColumnAlignment } from "../model/cell-attributes";
import { TableHeaderInner } from "./TableHeaderInner";
import type { TableColumnProps, TableModelProps } from "../model/use-table-core";
import type { ColumnAlign } from "../types";

interface TableHeaderCellProps<TData> extends TableModelProps<TData> {
  header: Header<TData, unknown>;
}

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

interface InternalHeaderCellProps<TData> extends TableModelProps<TData> {
  className: string;
  attributes: object;
}

const SelectHeaderCell = <TData,>({ model, className, attributes }: InternalHeaderCellProps<TData>) => {
  const { selection, settings } = model;
  if (!selection) return null;
  return (
    <th className={className} {...attributes}>
      <SelectHeaderContent selection={selection} labels={settings.labels} hasPrintMode={Boolean(settings.printMode)} />
    </th>
  );
};

interface DataHeaderCellProps<TData> extends TableColumnProps<TData>, Omit<InternalHeaderCellProps<TData>, "model"> {
  align?: ColumnAlign;
}

const DataHeaderCell = <TData,>({ column, model, className, attributes, align }: DataHeaderCellProps<TData>) => (
  <th className={className} style={{ width: column.width }} {...attributes}>
    <TableHeaderInner column={column} model={model} align={align} />
  </th>
);

export const TableHeaderCell = <TData,>({
  header,
  model,
}: TableHeaderCellProps<TData>) => {
  const align = readColumnAlignment(header.column.columnDef).header;
  const attributes = buildCellAttributes(header.column.id, align, model.hiddenByPriority);
  const className = cn("gdy-table-head-cell", model.settings.classNames?.headCell);
  if (header.column.id === SELECT_COLUMN_ID) {
    return <SelectHeaderCell model={model} className={className} attributes={attributes} />;
  }
  const column = model.settings.columns.find((item) => item.id === header.column.id);
  if (!column) {
    return <ActionsHeaderCell label={model.settings.rowActions?.columnLabel} className={className} attributes={attributes} />;
  }
  return <DataHeaderCell column={column} model={model} className={className} attributes={attributes} align={align} />;
};
