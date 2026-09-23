import type { DataTableFeatures } from "./types";

export const DEFAULT_PAGE_SIZES = [15, 25, 50, 100];

export const DEFAULT_FEATURES: Required<DataTableFeatures> = {
  search: true,
  sorting: true,
  filtering: true,
  pagination: true,
  rowActions: true,
  createButton: true,
  grouping: true,
};
