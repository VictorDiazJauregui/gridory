import {
  applyPropDefaults,
  resolveCalendarYearDefaults,
} from "../shared/prop-defaults";
import { DEFAULT_KANBAN_FEATURES } from "./constants";
import type {
  DateInputFormat,
  KanbanBoardFeatures,
  KanbanBoardProps,
  KanbanGroupOption,
} from "./types";

interface KanbanBoardDefaults {
  groupSelectorLabel: string;
  searchPlaceholder: string;
  createLabel: string;
  emptyMessage: string;
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
  KanbanBoardDefaults & { flags: Required<KanbanBoardFeatures> };

const resolveBoardDefaults = (): KanbanBoardDefaults => ({
  groupSelectorLabel: "Agrupar por",
  searchPlaceholder: "Buscar cards...",
  createLabel: "Nuevo",
  emptyMessage: "No se encontraron resultados",
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
): KanbanBoardView<TData> => ({
  ...applyPropDefaults(resolveBoardDefaults(), props),
  flags: { ...DEFAULT_KANBAN_FEATURES, ...props.features },
});

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
