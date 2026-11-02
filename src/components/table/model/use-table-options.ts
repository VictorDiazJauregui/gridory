import {
  getCoreRowModel,
  getSortedRowModel,
  type TableOptions,
} from "@tanstack/react-table";
import type { TableCore } from "./use-table-core";
import { useTableColumns } from "./use-table-columns";

// Only with a checkbox or expand column: a table without them keeps the options it had.
const buildInternalColumnMeta = <TData>({ selection, expansion, settings }: TableCore<TData>) => {
  if (!selection && !expansion) return {};
  return { meta: { selection, expansion, labels: settings.labels, hasPrintMode: Boolean(settings.printMode) } };
};

export const useTableOptions = <TData>(core: TableCore<TData>): TableOptions<TData> => {
  const { paging, settings, state, selection, expansion } = core;
  const internalColumns = { hasSelection: selection !== null, hasExpansion: expansion !== null };
  const columns = useTableColumns(settings, state.activeGroupBy, internalColumns);
  const { getRowId, columnVisibility } = settings;
  return {
    ...(columnVisibility ? { state: { columnVisibility } } : {}),
    ...buildInternalColumnMeta(core),
    data: paging.pagedRows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
  };
};
