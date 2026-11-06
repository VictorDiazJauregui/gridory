import type { CardGridFeatures } from "./types";

export const DEFAULT_CARD_GRID_FEATURES: Required<CardGridFeatures> = {
  search: true,
  sorting: true,
  filtering: true,
  pagination: true,
  rowActions: true,
  createButton: true,
};

export const DEFAULT_CARD_GRID_PAGE_SIZE = 25;
