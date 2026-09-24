import { useReactTable } from "@tanstack/react-table";
import "./styles.css";
import { cn } from "../../lib/cn";
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

const resolveRootClassName = <TData,>(settings: TableSettings<TData>) => {
  const showStickyHeader =
    settings.stickyHeader &&
    (settings.fillHeight || Boolean(settings.tableMaxHeightClassName));
  return cn(
    "gdy-table",
    settings.fillHeight && "gdy-table-fill",
    showStickyHeader && "gdy-table-sticky",
    settings.thinScrollbars && "gdy-thin-scroll",
  );
};

export const DataTable = <TData,>(props: DataTableProps<TData>) => {
  const core = useTableCore(props);
  const table = useReactTable(useTableOptions(core));
  const model: TableModel<TData> = { ...core, table };
  return (
    <div
      className={resolveRootClassName(core.settings)}
      style={resolveRootStyle(core.settings)}
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
  ColumnDefinition,
  DataTableProps,
  FilterOption,
  GroupHeader,
  RowActions,
  RowGroupingResult,
  DataTableFeatures,
  DataInput,
  ViewMode,
  ViewSwitchConfig,
} from "./types";

export type {
  RowAction,
  RowActionPlacement,
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
export type {
  HeaderSelectConfig,
  SelectOption,
  ToggleDisplay,
  ToggleGroupConfig,
  ToggleOption,
} from "../shared/toolbar-controls";
