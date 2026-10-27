import type { ReactNode } from "react";
import {
  applyPropDefaults,
  resolveCalendarYearDefaults,
} from "../shared/prop-defaults";
import { DEFAULT_FEATURES, DEFAULT_PAGE_SIZES } from "./constants";
import type { DataTableFeatures, DataTableLabels, DataTableProps } from "./types";

type TableBehaviorKey =
  | "pageSizeOptions"
  | "defaultPageSize"
  | "manualPagination"
  | "manualSorting"
  | "manualFiltering"
  | "tableMinHeightClassName"
  | "scrollResetOnPageChange"
  | "stickyHeader"
  | "fillHeight"
  | "thinScrollbars"
  | "dateFilterRequireOperator"
  | "dateInputFormat"
  | "calendarMonthYearDropdown"
  | "defaultGroupBy";

const TABLE_PROP_DEFAULTS: Required<Pick<DataTableProps<unknown>, TableBehaviorKey>> = {
  pageSizeOptions: DEFAULT_PAGE_SIZES,
  defaultPageSize: 50,
  manualPagination: false,
  manualSorting: false,
  manualFiltering: false,
  tableMinHeightClassName: "gdy-table-min-h-md",
  scrollResetOnPageChange: true,
  stickyHeader: true,
  fillHeight: false,
  thinScrollbars: true,
  dateFilterRequireOperator: true,
  dateInputFormat: "dd/mm/yyyy",
  calendarMonthYearDropdown: true,
  defaultGroupBy: null,
};

// The single-text props predate `labels`: they default to their key and still win over it.
const textPropDefaults = (labels: DataTableLabels) => ({
  searchPlaceholder: labels.searchPlaceholder,
  createLabel: labels.createButton,
  emptyMessage: labels.emptyMessage as ReactNode,
  label: labels.itemsName,
  groupSelectorLabel: labels.groupSelector,
  groupNoneLabel: labels.groupNone,
  groupEmptyValueLabel: labels.groupEmptyValue,
});

export type TableSettings<TData> = DataTableProps<TData> &
  typeof TABLE_PROP_DEFAULTS &
  ReturnType<typeof textPropDefaults> &
  ReturnType<typeof resolveCalendarYearDefaults> & {
    labels: DataTableLabels;
    flags: Required<DataTableFeatures>;
  };

export const resolveTableSettings = <TData>(
  props: DataTableProps<TData>,
  labels: DataTableLabels,
): TableSettings<TData> => {
  const defaults = { ...TABLE_PROP_DEFAULTS, ...textPropDefaults(labels), ...resolveCalendarYearDefaults() };
  return {
    ...applyPropDefaults(defaults, props),
    labels,
    flags: { ...DEFAULT_FEATURES, ...props.features },
  };
};
