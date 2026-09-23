import { useMemo, useState } from "react";
import {
  resolveGroupOptions,
  resolveInitialGroupBy,
  toggleSetMember,
} from "./row-grouping";
import type { TableSettings } from "./settings";

export const useRowGroupingState = <TData>(settings: TableSettings<TData>) => {
  const { columns, groupableColumnIds } = settings;
  const [activeGroupBy, setActiveGroupBy] = useState<string | null>(() =>
    resolveInitialGroupBy(settings),
  );
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    () => new Set(),
  );
  const groupOptions = useMemo(
    () => resolveGroupOptions(columns, groupableColumnIds),
    [groupableColumnIds, columns],
  );
  const toggleGroup = (value: string) =>
    setCollapsedGroups((previous) => toggleSetMember(previous, value));
  return {
    activeGroupBy,
    setActiveGroupBy,
    collapsedGroups,
    setCollapsedGroups,
    groupOptions,
    toggleGroup,
  };
};
