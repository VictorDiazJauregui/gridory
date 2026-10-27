import { DATA_VIEW_LABELS } from "../shared/labels/data-view-labels";
import { formatDateValue } from "./card/card-summary";
import type { KanbanBoardLabels } from "./types";

export const KANBAN_BOARD_LABELS: KanbanBoardLabels = {
  ...DATA_VIEW_LABELS,
  searchPlaceholder: "Buscar cards...",
  emptyColumn: "Sin cards",
  emptyValue: "Sin valor",
  untitledCard: "Card",
  cardFieldLabel: (header) => `${header}:`,
  formatCardDate: formatDateValue,
};
