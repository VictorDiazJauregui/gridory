import type { ComponentProps } from "react";
import type { Toolbar } from "../../shared/toolbar/Toolbar";
import type { SelectOption } from "../../shared/toolbar-controls";
import type { KanbanBoardView } from "../board-view";
import type { KanbanBoardState } from "../model/use-kanban-board-state";

type ToolbarGroupSelector = ComponentProps<typeof Toolbar>["groupSelector"];

export const buildGroupSelectOptions = <TData>(view: KanbanBoardView<TData>): SelectOption[] =>
  view.groups.map((group) => ({
    value: group.id,
    label: view.labels.labeledValue(view.groupSelectorLabel, group.label),
  }));

export const buildGroupSelector = <TData>(
  state: KanbanBoardState<TData>,
  view: KanbanBoardView<TData>,
): ToolbarGroupSelector => {
  if (!view.flags.groupSelector) return undefined;
  return {
    options: buildGroupSelectOptions(view),
    value: state.selectedGroup.id,
    onChange: state.changeGroup,
    ariaLabel: view.groupSelectorLabel,
  };
};
