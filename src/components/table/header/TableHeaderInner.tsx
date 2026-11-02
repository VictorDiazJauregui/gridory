import { useId, type ReactNode } from "react";
import type { ColumnAlign, ColumnDefinition, HeaderTooltipPlacement } from "../types";
import type { TableColumnProps } from "../model/use-table-core";
import { TableColumnFilterMenu } from "./TableColumnFilterMenu";
import { TableHeaderHelp, TableHeaderHelpDescription } from "./TableHeaderHelp";
import { TableHeaderTrigger } from "./TableHeaderTrigger";

interface TableHeaderInnerProps<TData> extends TableColumnProps<TData> {
  align?: ColumnAlign;
}

const isFilterMenuOpen = <TData,>({ column, model }: TableColumnProps<TData>) =>
  model.state.openFilterColumnId === column.id && model.settings.flags.filtering && Boolean(column.filterable);

// A right-aligned title keeps its edge, like the numbers below it, so the icon goes before it.
const resolveHelpPlacement = <TData,>(column: ColumnDefinition<TData>, align?: ColumnAlign): HeaderTooltipPlacement =>
  column.headerTooltipPlacement ?? (align === "right" ? "before" : "after");

const isHelpFirst = (placement: HeaderTooltipPlacement, align?: ColumnAlign) =>
  placement === "before" || (placement === "edge" && align === "right");

interface HeaderWithHelpProps<TData> extends TableHeaderInnerProps<TData> {
  tooltip: string;
  filterMenu: ReactNode;
}

// Only a header with help asks for an id: an unused useId would shift every id after it.
const HeaderInnerWithHelp = <TData,>({ column, model, align, tooltip, filterMenu }: HeaderWithHelpProps<TData>) => {
  const descriptionId = useId();
  const placement = resolveHelpPlacement(column, align);
  const help = <TableHeaderHelp text={tooltip} label={model.settings.labels.columnHelp(column.header)} />;
  const helpFirst = isHelpFirst(placement, align);
  return (
    <div className="gdy-table-head-inner" data-help-placement={placement}>
      {helpFirst && help}
      <TableHeaderTrigger column={column} model={model} align={align} descriptionId={descriptionId} />
      {!helpFirst && help}
      <TableHeaderHelpDescription text={tooltip} descriptionId={descriptionId} />
      {filterMenu}
    </div>
  );
};

export const TableHeaderInner = <TData,>({ column, model, align }: TableHeaderInnerProps<TData>) => {
  const filterMenu = isFilterMenuOpen({ column, model }) && <TableColumnFilterMenu column={column} model={model} />;
  if (column.headerTooltip) {
    return <HeaderInnerWithHelp column={column} model={model} align={align} tooltip={column.headerTooltip} filterMenu={filterMenu} />;
  }
  return (
    <div className="gdy-table-head-inner">
      <TableHeaderTrigger column={column} model={model} align={align} />
      {filterMenu}
    </div>
  );
};
