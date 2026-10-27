import type { ComponentProps } from "react";
import { Toolbar } from "../shared/toolbar/Toolbar";
import {
  buildArchivedToolbarProps,
  pickToolbarPassThrough,
} from "../shared/toolbar/toolbar-props";
import { GROUP_NONE_VALUE } from "./constants";
import { buildGroupSelectOptions } from "./model/row-grouping";
import type { TableModel } from "./model/use-table-core";

const selectGroupBy = <TData>(
  { settings, state, paging }: TableModel<TData>,
  next: string | null,
) => {
  state.setActiveGroupBy(next);
  state.setCollapsedGroups(new Set());
  paging.resetToFirstPage();
  settings.onGroupChange?.(next);
};

const buildGroupSelector = <TData>(model: TableModel<TData>) => {
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

const buildSearchToolbarProps = <TData>(model: TableModel<TData>) => {
  const { settings, state } = model;
  const { flags } = settings;
  return {
    showSearch: flags.search,
    search: state.search,
    searchPlaceholder: settings.searchPlaceholder,
    onSearchChange: state.changeSearch,
    showClearFilters: flags.filtering && state.hasActiveFilters,
    onClearFilters: state.clearFilters,
    showCreateButton: flags.createButton,
    createLabel: settings.createLabel,
    onCreate: settings.onCreate,
  };
};

export const buildToolbarProps = <TData>(
  model: TableModel<TData>,
): ComponentProps<typeof Toolbar> => ({
  ...buildSearchToolbarProps(model),
  groupSelector: buildGroupSelector(model),
  ...buildArchivedToolbarProps(model.settings, model.state),
  ...pickToolbarPassThrough(model.settings),
  className: model.settings.classNames?.toolbar,
});
