import type { Header } from "@tanstack/react-table";
import { cn } from "../../../lib/cn";
import { ACTIONS_COLUMN_ID, EXPAND_COLUMN_ID, SELECT_COLUMN_ID } from "../columns/internal-columns";
import { SelectHeaderContent } from "../selection/RowSelectCell";
import { buildCellAttributes, readColumnAlignment, type CellAttributes } from "../model/cell-attributes";
import { TableHeaderInner } from "./TableHeaderInner";
import type { TableColumnProps, TableModelProps } from "../model/use-table-core";
import type { ColumnAlign } from "../types";

interface TableHeaderCellProps<TData> extends TableModelProps<TData> {
  header: Header<TData, unknown>;
}

interface InternalHeaderCellProps<TData> extends TableModelProps<TData> {
  className: string;
  attributes: CellAttributes;
}

// Unpinned, the actions header keeps no width (as before pinning existed); pinned, the sticky offsets need it.
const resolveActionsHeaderStyle = <TData,>({ model, attributes }: InternalHeaderCellProps<TData>) => {
  const width = model.pinnedColumns?.placements.get(ACTIONS_COLUMN_ID)?.width;
  return width === undefined ? attributes.style : { ...attributes.style, width };
};

// The actions column has no definition of its own: an optional label and no trigger.
const ActionsHeaderCell = <TData,>(props: InternalHeaderCellProps<TData>) => {
  const label = props.model.settings.rowActions?.columnLabel;
  return (
    <th className={props.className} {...props.attributes} style={resolveActionsHeaderStyle(props)}>
      {label ? <span className="gdy-table-actions-head-label">{label}</span> : null}
    </th>
  );
};

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
  <th className={className} {...attributes} style={{ width: column.width, ...attributes.style }}>
    <TableHeaderInner column={column} model={model} align={align} />
  </th>
);

export const TableHeaderCell = <TData,>({
  header,
  model,
}: TableHeaderCellProps<TData>) => {
  const align = readColumnAlignment(header.column.columnDef).header;
  const attributes = buildCellAttributes(header.column.id, align, model);
  const className = cn("gdy-table-head-cell", model.settings.classNames?.headCell);
  if (header.column.id === EXPAND_COLUMN_ID) return <th className={className} {...attributes} />;
  if (header.column.id === SELECT_COLUMN_ID) {
    return <SelectHeaderCell model={model} className={className} attributes={attributes} />;
  }
  const column = model.settings.columns.find((item) => item.id === header.column.id);
  if (!column) {
    return <ActionsHeaderCell model={model} className={className} attributes={attributes} />;
  }
  return <DataHeaderCell column={column} model={model} className={className} attributes={attributes} align={align} />;
};
