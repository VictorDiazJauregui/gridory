import { hasColumnFilter } from "../../shared/controls/column-filters";
import { resolveHeaderAction } from "./header-action";
import { TableHeaderIcons } from "./TableHeaderIcons";
import type { TableColumnProps } from "../model/use-table-core";

export const TableHeaderTrigger = <TData,>({
  column,
  model,
}: TableColumnProps<TData>) => {
  const { filters, dateFilters } = model.state;
  const isFiltered = hasColumnFilter(column.id, filters, dateFilters);
  return (
    <button
      type="button"
      className="gdy-table-head-trigger"
      data-filtered={isFiltered || undefined}
      onClick={resolveHeaderAction(column, model)}
    >
      <span className="gdy-table-head-label" title={column.header}>
        {column.header}
      </span>
      <TableHeaderIcons column={column} model={model} isFiltered={isFiltered} />
    </button>
  );
};
