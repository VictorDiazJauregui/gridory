import { GROUP_NONE_VALUE } from "./constants";
import { buildGroupSelectOptions } from "./row-grouping";
import type { TableModel } from "./use-table-core";

export const buildSearchChangeHandler =
  <TData>({ settings, state, paging }: TableModel<TData>) =>
  (value: string) => {
    state.setSearch(value);
    settings.onSearchChange?.(value);
    if (settings.manualPagination) paging.setPageIndex(0);
  };

const selectGroupBy = <TData>(
  { settings, state, paging }: TableModel<TData>,
  next: string | null,
) => {
  state.setActiveGroupBy(next);
  state.setCollapsedGroups(new Set());
  paging.setPageIndex(0);
  settings.onGroupChange?.(next);
};

export const buildGroupSelector = <TData>(model: TableModel<TData>) => {
  const { settings, state } = model;
  const { groupSelectorLabel, groupNoneLabel } = settings;
  if (!settings.flags.grouping || state.groupOptions.length === 0) {
    return undefined;
  }
  return {
    options: buildGroupSelectOptions(
      state.groupOptions,
      groupSelectorLabel,
      groupNoneLabel,
    ),
    value: state.activeGroupBy ?? GROUP_NONE_VALUE,
    onChange: (value: string) =>
      selectGroupBy(model, value === GROUP_NONE_VALUE ? null : value),
    ariaLabel: groupSelectorLabel,
  };
};
