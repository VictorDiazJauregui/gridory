import type { ComponentProps } from "react";
import type { Toolbar } from "../../shared/toolbar/Toolbar";
import { buildArchivedToolbarProps, pickToolbarPassThrough } from "../../shared/toolbar/toolbar-props";
import type { CardGridModel } from "../model/use-card-grid-model";

export const buildCardGridToolbarProps = <TData>({ settings, controls }: CardGridModel<TData>): ComponentProps<typeof Toolbar> => ({
  showSearch: settings.flags.search,
  search: controls.search,
  searchPlaceholder: settings.searchPlaceholder,
  onSearchChange: controls.setSearch,
  showClearFilters: settings.flags.filtering && controls.hasActiveFilters,
  onClearFilters: controls.clearFilters,
  showCreateButton: settings.flags.createButton,
  createLabel: settings.createLabel,
  onCreate: settings.onCreate,
  ...buildArchivedToolbarProps(settings, controls),
  ...pickToolbarPassThrough(settings),
  className: settings.classNames?.toolbar,
});
