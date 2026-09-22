import type { DateFilterState, ReusableTableFeatures } from "./types";

export const DEFAULT_PAGE_SIZES = [15, 25, 50, 100];

export const DEFAULT_FEATURES: Required<ReusableTableFeatures> = {
  search: true,
  sorting: true,
  filtering: true,
  pagination: true,
  rowActions: true,
  createButton: true,
  grouping: true,
};

export const EMPTY_DATE_FILTER_STATE: DateFilterState = {
  op: "",
  date: "",
  dateFrom: "",
  dateTo: "",
};
