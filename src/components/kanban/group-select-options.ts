import type { SelectOption } from "../shared/toolbar-controls";
import type { KanbanGroupOption } from "./types";

export const buildGroupSelectOptions = <TData>(
  groups: KanbanGroupOption<TData>[],
  selectorLabel: string,
): SelectOption[] =>
  groups.map((group) => ({
    value: group.id,
    label: `${selectorLabel}: ${group.label}`,
  }));
