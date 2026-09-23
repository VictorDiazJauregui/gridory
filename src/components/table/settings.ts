import {
  applyPropDefaults,
  resolveCalendarYearDefaults,
} from "../shared/prop-defaults";
import { DEFAULT_FEATURES, DEFAULT_PAGE_SIZES } from "./constants";
import type { DataTableFeatures, DataTableProps } from "./types";

type TableDefaultKey =
  | "searchPlaceholder"
  | "createLabel"
  | "emptyMessage"
  | "label"
  | "pageSizeOptions"
  | "defaultPageSize"
  | "manualPagination"
  | "tableMinHeightClassName"
  | "scrollResetOnPageChange"
  | "stickyHeader"
  | "fillHeight"
  | "thinScrollbars"
  | "dateFilterRequireOperator"
  | "dateInputFormat"
  | "calendarMonthYearDropdown"
  | "defaultGroupBy"
  | "groupSelectorLabel"
  | "groupNoneLabel"
  | "groupEmptyValueLabel";

const TABLE_PROP_DEFAULTS: Required<
  Pick<DataTableProps<unknown>, TableDefaultKey>
> = {
  searchPlaceholder: "Buscar...",
  createLabel: "Nuevo",
  emptyMessage: "No se encontraron resultados",
  label: "elementos",
  pageSizeOptions: DEFAULT_PAGE_SIZES,
  defaultPageSize: 50,
  manualPagination: false,
  tableMinHeightClassName: "gdy-table-min-h-md",
  scrollResetOnPageChange: true,
  stickyHeader: true,
  fillHeight: false,
  thinScrollbars: true,
  dateFilterRequireOperator: true,
  dateInputFormat: "dd/mm/yyyy",
  calendarMonthYearDropdown: true,
  defaultGroupBy: null,
  groupSelectorLabel: "Agrupar por",
  groupNoneLabel: "Ninguno",
  groupEmptyValueLabel: "Sin valor",
};

export type TableSettings<TData> = DataTableProps<TData> &
  typeof TABLE_PROP_DEFAULTS &
  ReturnType<typeof resolveCalendarYearDefaults> & {
    flags: Required<DataTableFeatures>;
  };

export const resolveTableSettings = <TData>(
  props: DataTableProps<TData>,
): TableSettings<TData> => ({
  ...applyPropDefaults(
    { ...TABLE_PROP_DEFAULTS, ...resolveCalendarYearDefaults() },
    props,
  ),
  flags: { ...DEFAULT_FEATURES, ...props.features },
});
