import { useArchivedRows } from "../shared/use-archived-rows";
import { useSearchedRows } from "../shared/use-searched-rows";
import type { TableSettings } from "./settings";
import type { TableState } from "./use-table-state";

export const useSearchedTableRows = <TData>(
  rows: TData[],
  settings: TableSettings<TData>,
  state: TableState,
) => {
  const { columns, archivedView, rowActions, manualPagination } = settings;
  const searched = useSearchedRows({
    rows,
    columns,
    query: state.search,
    enabled: settings.flags.search && !manualPagination,
  });
  return useArchivedRows({
    rows: searched,
    archivedView,
    mode: state.archivedMode,
    rowActions,
  });
};
