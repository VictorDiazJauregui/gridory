import { FilterMenuHolder } from "../../shared/controls/FilterMenuHolder";
import { TableDateFilterMenu } from "./TableDateFilterMenu";
import { TableValueFilterMenu } from "./TableValueFilterMenu";
import type { TableColumnProps } from "../model/use-table-core";

export const TableColumnFilterMenu = <TData,>({
  column,
  model,
}: TableColumnProps<TData>) => {
  const { filterMenuRef } = model.state;
  return (
    <FilterMenuHolder className="gdy-table-menu-holder" holderRef={filterMenuRef}>
      {column.type === "date" ? (
        <TableDateFilterMenu column={column} model={model} />
      ) : (
        <TableValueFilterMenu column={column} model={model} />
      )}
    </FilterMenuHolder>
  );
};
