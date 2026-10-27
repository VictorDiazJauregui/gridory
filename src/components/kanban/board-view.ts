import type { ReactNode } from "react";
import {
  applyPropDefaults,
  resolveCalendarYearDefaults,
} from "../shared/prop-defaults";
import { DEFAULT_KANBAN_FEATURES } from "./constants";
import type {
  DateInputFormat,
  KanbanBoardFeatures,
  KanbanBoardLabels,
  KanbanBoardProps,
  KanbanGroupOption,
} from "./types";

interface KanbanBoardDefaults {
  groupSelectorLabel: string;
  searchPlaceholder: string;
  createLabel: string;
  emptyMessage: ReactNode;
  boardMinHeightClassName: string;
  columnBodyMaxHeight: number;
  thinScrollbars: boolean;
  dateFilterRequireOperator: boolean;
  dateInputFormat: DateInputFormat;
  calendarMonthYearDropdown: boolean;
  calendarFromYear: number;
  calendarToYear: number;
}

export type KanbanBoardView<TData> = KanbanBoardProps<TData> &
  KanbanBoardDefaults & { labels: KanbanBoardLabels; flags: Required<KanbanBoardFeatures> };

// The single-text props predate `labels`: they default to their key and still win over it.
const resolveBoardDefaults = (labels: KanbanBoardLabels): KanbanBoardDefaults => ({
  groupSelectorLabel: labels.groupSelector,
  searchPlaceholder: labels.searchPlaceholder,
  createLabel: labels.createButton,
  emptyMessage: labels.emptyMessage,
  boardMinHeightClassName: "gdy-kanban-min-h-md",
  columnBodyMaxHeight: 480,
  thinScrollbars: true,
  dateFilterRequireOperator: true,
  dateInputFormat: "dd/mm/yyyy",
  calendarMonthYearDropdown: true,
  ...resolveCalendarYearDefaults(),
});

export const applyBoardDefaults = <TData>(
  props: KanbanBoardProps<TData>,
  labels: KanbanBoardLabels,
): KanbanBoardView<TData> => {
  return {
    ...applyPropDefaults(resolveBoardDefaults(labels), props),
    labels,
    flags: { ...DEFAULT_KANBAN_FEATURES, ...props.features },
  };
};

export const assertGroupConfiguration = <TData>(
  groups: KanbanGroupOption<TData>[],
  defaultGroupId: string,
) => {
  if (groups.length === 0) {
    throw new Error(
      "KanbanBoard requiere al menos una configuración de agrupación en `groups`.",
    );
  }
  if (!groups.some((group) => group.id === defaultGroupId)) {
    throw new Error(
      "KanbanBoard requiere que `defaultGroupId` exista dentro de `groups`.",
    );
  }
};
