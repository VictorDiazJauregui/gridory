import { useMemo } from "react";
import { useControllableState } from "../../shared/state/use-controllable-state";
import type { KanbanBoardProps } from "../types";

type CollapseSettings = Pick<
  KanbanBoardProps<unknown>,
  "collapsibleColumns" | "collapsedColumns" | "defaultCollapsedColumns" | "onCollapsedColumnsChange"
>;

const NO_COLLAPSED_COLUMNS: string[] = [];

const toggleValue = (values: string[], value: string) =>
  values.includes(value) ? values.filter((current) => current !== value) : [...values, value];

/** Which columns are collapsed, by value; none while `collapsibleColumns` is off. */
export const useCollapsedColumns = (settings: CollapseSettings) => {
  const [values, setValues] = useControllableState({
    value: settings.collapsedColumns,
    defaultValue: settings.defaultCollapsedColumns ?? NO_COLLAPSED_COLUMNS,
    onChange: settings.onCollapsedColumnsChange,
    name: "collapsedColumns",
  });
  const enabled = settings.collapsibleColumns === true;
  const collapsed = useMemo(() => new Set(enabled ? values : NO_COLLAPSED_COLUMNS), [enabled, values]);
  return {
    enabled,
    isCollapsed: (value: string) => collapsed.has(value),
    toggleColumn: (value: string) => setValues((previous) => toggleValue(previous, value)),
  };
};

export type ColumnCollapse = ReturnType<typeof useCollapsedColumns>;
