import { hasColumnFilter } from "../../shared/controls/column-filters";
import { resolveHeaderAction } from "./header-action";
import { TableHeaderIcons } from "./TableHeaderIcons";
import type { ColumnAlign } from "../types";
import type { TableColumnProps } from "../model/use-table-core";

interface TableHeaderTriggerProps<TData> extends TableColumnProps<TData> {
  align?: ColumnAlign;
  /** Id of the hidden help text (`headerTooltip`), read after the title. */
  descriptionId?: string;
}

export const TableHeaderTrigger = <TData,>({ column, model, align, descriptionId }: TableHeaderTriggerProps<TData>) => {
  const isFiltered = hasColumnFilter(column.id, model.state.filters, model.state.dateFilters);
  return (
    <button
      type="button"
      className="gdy-table-head-trigger"
      data-filtered={isFiltered || undefined}
      data-align={align}
      aria-label={column.headerContent === undefined ? undefined : column.header}
      aria-describedby={descriptionId}
      onClick={resolveHeaderAction(column, model)}
    >
      <span className="gdy-table-head-label" title={column.header}>
        {column.headerContent ?? column.header}
      </span>
      <TableHeaderIcons column={column} model={model} isFiltered={isFiltered} />
    </button>
  );
};
