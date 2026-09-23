import { useMemo } from "react";
import { applyRowGrouping } from "./row-grouping";
import type { TableSettings } from "../settings";
import type { TableState } from "./use-table-state";

export const useGroupedRows = <TData>(
  rows: TData[],
  settings: TableSettings<TData>,
  state: TableState,
) => {
  const { columns, groupEmptyValueLabel } = settings;
  const { activeGroupBy } = state;
  const groupingEnabled = settings.flags.grouping;
  return useMemo(
    () =>
      applyRowGrouping({
        rows,
        columns,
        activeGroupBy: groupingEnabled ? activeGroupBy : null,
        emptyLabel: groupEmptyValueLabel,
      }),
    [rows, columns, activeGroupBy, groupingEnabled, groupEmptyValueLabel],
  );
};
