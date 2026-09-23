import { Toolbar } from "../../shared/toolbar/Toolbar";
import {
  buildArchivedToolbarProps,
  pickToolbarPassThrough,
} from "../../shared/toolbar/toolbar-props";
import { buildGroupSelector } from "./group-select-options";
import type { KanbanSectionProps } from "../model/use-kanban-board-state";

export const KanbanToolbar = <TData,>({
  state,
  view,
}: KanbanSectionProps<TData>) => (
  <Toolbar
    showSearch={view.flags.search}
    search={state.search}
    searchPlaceholder={view.searchPlaceholder}
    onSearchChange={state.setSearch}
    showClearFilters={view.flags.filtering && state.hasActiveFilters}
    onClearFilters={state.clearFilters}
    groupSelector={buildGroupSelector(state, view)}
    showCreateButton={view.flags.createButton}
    createLabel={view.createLabel}
    onCreate={view.onCreate}
    {...buildArchivedToolbarProps(view, state)}
    {...pickToolbarPassThrough(view)}
  />
);
