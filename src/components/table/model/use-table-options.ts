import {
  getCoreRowModel,
  getSortedRowModel,
  type TableOptions,
} from "@tanstack/react-table";
import type { TableCore } from "./use-table-core";
import { useTableColumns } from "./use-table-columns";

export const useTableOptions = <TData>({
  paging,
  settings,
  state,
  selection,
}: TableCore<TData>): TableOptions<TData> => {
  const columns = useTableColumns(settings, state.activeGroupBy, selection);
  const { getRowId, columnVisibility } = settings;
  return {
    ...(columnVisibility ? { state: { columnVisibility } } : {}),
    data: paging.pagedRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
  };
};
