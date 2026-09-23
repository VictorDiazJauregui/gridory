import { TableHeaderCell } from "./TableHeaderCell";
import type { TableModelProps } from "../model/use-table-core";

export const TableHead = <TData,>({ model }: TableModelProps<TData>) => (
  <thead className="gdy-table-head">
    {model.table.getHeaderGroups().map((group) => (
      <tr key={group.id} className="gdy-table-head-row">
        {group.headers.map((header) => (
          <TableHeaderCell key={header.id} header={header} model={model} />
        ))}
      </tr>
    ))}
  </thead>
);
