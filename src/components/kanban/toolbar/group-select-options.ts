import type { ComponentProps } from "react";
import type { Toolbar } from "../../shared/toolbar";
import type { SelectOption } from "../../shared/toolbar-controls";
import type { KanbanBoardView } from "../board-view";
import type { KanbanGroupOption } from "../types";
import type { KanbanBoardState } from "../model/use-kanban-board-state";

type ToolbarGroupSelector = ComponentProps<typeof Toolbar>["groupSelector"];

export const buildGroupSelectOptions = <TData>(
  groups: KanbanGroupOption<TData>[],
  selectorLabel: string,
): SelectOption[] =>
  groups.map((group) => ({
    value: group.id,
    label: `${selectorLabel}: ${group.label}`,
  }));

export const buildGroupSelector = <TData>(
  state: KanbanBoardState<TData>,
  view: KanbanBoardView<TData>,
): ToolbarGroupSelector => {
  if (!view.flags.groupSelector) return undefined;
  return {
    options: buildGroupSelectOptions(view.groups, view.groupSelectorLabel),
    value: state.selectedGroup.id,
    onChange: state.changeGroup,
    ariaLabel: view.groupSelectorLabel,
  };
};
