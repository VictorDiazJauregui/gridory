import type { ReusableKanbanFeatures } from "./types";

export const DEFAULT_KANBAN_FEATURES: Required<ReusableKanbanFeatures> = {
  search: true,
  sorting: true,
  filtering: true,
  createButton: true,
  rowActions: true,
  groupSelector: true,
  dragAndDrop: true,
};
