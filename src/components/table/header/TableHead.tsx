import { cn } from "../../../lib/cn";
import { TableHeaderCell } from "./TableHeaderCell";
import type { TableModelProps } from "../model/use-table-core";

export const TableHead = <TData,>({ model }: TableModelProps<TData>) => (
  <thead className="gdy-table-head">
    {model.table.getHeaderGroups().map((group) => (
      <tr key={group.id} className={cn("gdy-table-head-row", model.settings.classNames?.headRow)}>
        {group.headers.map((header) => (
          <TableHeaderCell key={header.id} header={header} model={model} />
        ))}
      </tr>
    ))}
  </thead>
);
