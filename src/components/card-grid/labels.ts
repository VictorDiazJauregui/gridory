import { KANBAN_BOARD_LABELS } from "../kanban/labels";
import { DATA_VIEW_LABELS } from "../shared/labels/data-view-labels";
import { DATA_TABLE_LABELS } from "../table/labels";
import type { CardGridLabels } from "./types";

// The pagination texts are the table's and the card texts the kanban's, so the three views read alike.
export const CARD_GRID_LABELS: CardGridLabels = {
  ...DATA_VIEW_LABELS,
  itemsName: DATA_TABLE_LABELS.itemsName,
  showing: DATA_TABLE_LABELS.showing,
  pageSize: DATA_TABLE_LABELS.pageSize,
  pageOf: DATA_TABLE_LABELS.pageOf,
  previousPage: DATA_TABLE_LABELS.previousPage,
  nextPage: DATA_TABLE_LABELS.nextPage,
  untitledCard: KANBAN_BOARD_LABELS.untitledCard,
  cardFieldLabel: KANBAN_BOARD_LABELS.cardFieldLabel,
  formatCardDate: KANBAN_BOARD_LABELS.formatCardDate,
};
