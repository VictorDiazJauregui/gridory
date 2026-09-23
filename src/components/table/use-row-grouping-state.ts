import { useMemo, useState } from "react";
import { resolveGroupOptions, resolveInitialGroupBy } from "./row-grouping";
import type { TableSettings } from "./settings";
import { useCollapsedGroups } from "./use-collapsed-groups";

export const useRowGroupingState = <TData>(settings: TableSettings<TData>) => {
  const { columns, groupableColumnIds } = settings;
  const [activeGroupBy, setActiveGroupBy] = useState<string | null>(() =>
    resolveInitialGroupBy(settings),
  );
  const collapsed = useCollapsedGroups();
  const groupOptions = useMemo(
    () => resolveGroupOptions(columns, groupableColumnIds),
    [groupableColumnIds, columns],
  );
  return { activeGroupBy, setActiveGroupBy, groupOptions, ...collapsed };
};
