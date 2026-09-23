import { useMemo } from "react";
import { normalizeInputRows } from "../../shared/row-pipeline";
import type { TableSettings } from "../settings";
import { useFilteredTableRows } from "./use-filtered-table-rows";
import { useGroupedRows } from "./use-grouped-rows";
import { useSearchedTableRows } from "./use-searched-table-rows";
import type { TableState } from "./use-table-state";

export const useTableRows = <TData>(
  settings: TableSettings<TData>,
  state: TableState,
) => {
  const { data, normalizeRow } = settings;
  const rows = useMemo(
    () => normalizeInputRows(data, normalizeRow),
    [data, normalizeRow],
  );
  const searched = useSearchedTableRows(rows, settings, state);
  const sorted = useFilteredTableRows(searched, settings, state);
  const grouping = useGroupedRows(sorted, settings, state);
  return { rows, grouping };
};
