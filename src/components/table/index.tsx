import { useReactTable } from "@tanstack/react-table";
import "./styles.css";
import { cn } from "../../lib/cn";
import { buildLoadingRootAttributes } from "../shared/loading/loading-state";
import { resolveRootStyle } from "../shared/root-style";
import { Toolbar } from "../shared/toolbar/Toolbar";
import { buildPaginationProps } from "./pagination/pagination-props";
import type { TableSettings } from "./settings";
import { TableScrollArea } from "./body/TableScrollArea";
import { TablePagination } from "./pagination/TablePagination";
import { buildToolbarProps } from "./toolbar-props";
import type { DataTableProps } from "./types";
import { useTableCore, type TableModel } from "./model/use-table-core";
import { useTableOptions } from "./model/use-table-options";
import { useResponsiveColumns } from "./columns/use-responsive-columns";
import { useCloseHiddenFilterMenu, useColumnVisibilityReport } from "./columns/use-column-visibility-report";

const resolveRootClassName = <TData,>(settings: TableSettings<TData>) => {
  const showStickyHeader =
    settings.stickyHeader &&
    (settings.fillHeight || Boolean(settings.tableMaxHeightClassName));
  return cn(
    "gdy-table",
    settings.fillHeight && "gdy-table-fill",
    showStickyHeader && "gdy-table-sticky",
    settings.thinScrollbars && "gdy-thin-scroll",
    settings.className,
    settings.classNames?.root,
  );
};

const useTableModel = <TData,>(props: DataTableProps<TData>): TableModel<TData> => {
  const core = useTableCore(props);
  const table = useReactTable(useTableOptions(core));
  const hiddenByPriority = useResponsiveColumns({ settings: core.settings, table, wrapRef: core.paging.wrapRef });
  const model = { ...core, table, hiddenByPriority };
  useColumnVisibilityReport(model);
  useCloseHiddenFilterMenu(model);
  return model;
};

export const DataTable = <TData,>(props: DataTableProps<TData>) => {
  const model = useTableModel(props);
  const { settings } = model;
  return (
    <div
      className={resolveRootClassName(settings)}
      style={resolveRootStyle(settings)}
      data-print-mode={settings.printMode}
      {...buildLoadingRootAttributes(settings.loading)}
    >
      <div className="gdy-scope gdy-card">
        <Toolbar {...buildToolbarProps(model)} />
        <TableScrollArea model={model} />
        <TablePagination {...buildPaginationProps(model)} />
      </div>
    </div>
  );
};

export type {
  ArchivedViewConfig,
  ArchivedViewMode,
  DateFilterState,
  ManualPaginationState,
  AiButtonConfig,
  CellHighlight,
  ColumnAlign,
  ColumnDefinition,
  ColumnFiltersState,
  ColumnFooterContext,
  ColumnOverflow,
  DataTableClassNames,
  DataTableProps,
  FilterOption,
  GroupHeader,
  HeaderTooltipPlacement,
  RowActions,
  RowAttributes,
  RowClickEvent,
  RowGroupingResult,
  ColumnVisibilityDetails,
  RowSelectionConfig,
  SelectAllScope,
  DataTableFeatures,
  DataTableLabels,
  DataInput,
  ViewMode,
  ViewSwitchConfig,
  VisibleRowsState,
} from "./types";

export { MissingRowIdError } from "./selection/use-row-selection";
export type {
  RowAction,
  RowActionEntry,
  RowActionPlacement,
  RowActionSubmenu,
  RowActionVariant,
} from "../shared/menu/row-action";
export type {
  BuiltInActionId,
  BuiltInMenuRef,
  MenuItem,
  MenuLabel,
  MenuSeparator,
} from "../shared/menu/menu-nodes";
export type { SelectTheme } from "../shared/select-theme";
export type {
  ToolbarLayout,
  ToolbarSide,
} from "../shared/toolbar/toolbar-layout";
export type { ToolbarCustomSlot } from "../shared/toolbar/toolbar-custom-slots";
export type {
  HeaderSelectConfig,
  SelectOption,
  ToggleDisplay,
  ToggleGroupConfig,
  ToggleOption,
} from "../shared/toolbar-controls";
