import type { KanbanBoardFeatures } from "./types";

export const DEFAULT_KANBAN_FEATURES: Required<KanbanBoardFeatures> = {
  search: true,
  sorting: true,
  filtering: true,
  createButton: true,
  rowActions: true,
  groupSelector: true,
  dragAndDrop: true,
};
