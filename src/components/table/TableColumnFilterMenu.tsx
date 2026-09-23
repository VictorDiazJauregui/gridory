import { TableDateFilterMenu } from "./TableDateFilterMenu";
import { TableValueFilterMenu } from "./TableValueFilterMenu";
import type { TableColumnProps } from "./use-table-core";

export const TableColumnFilterMenu = <TData,>({
  column,
  model,
}: TableColumnProps<TData>) => {
  const { filterMenuRef } = model.state;
  return (
    <div className="gdy-table-menu-holder" ref={filterMenuRef}>
      {column.type === "date" ? (
        <TableDateFilterMenu column={column} model={model} />
      ) : (
        <TableValueFilterMenu column={column} model={model} />
      )}
    </div>
  );
};
