import { useReactTable } from "@tanstack/react-table";
import "./styles.css";
import { cn } from "../../lib/cn";
import { resolveRootStyle } from "../shared/root-style";
import { Toolbar } from "../shared/toolbar";
import {
  buildArchivedToolbarProps,
  pickToolbarPassThrough,
} from "../shared/toolbar/toolbar-props";
import { TableScrollArea } from "./TableScrollArea";
import { TablePagination } from "./TablePagination";
import { buildGroupSelector, buildSearchChangeHandler } from "./toolbar-props";
import type { DataTableProps } from "./types";
import { useTableCore, type TableModel } from "./use-table-core";
import { useTableOptions } from "./use-table-options";

export const DataTable = <TData,>(props: DataTableProps<TData>) => {
  const core = useTableCore(props);
  const table = useReactTable(useTableOptions(core));
  const model: TableModel<TData> = { ...core, table };
  const { settings, state, paging } = core;
  const { flags } = settings;
  const { range } = paging;
  const showStickyHeader =
    settings.stickyHeader &&
    (settings.fillHeight || Boolean(settings.tableMaxHeightClassName));
  const rootStyle = resolveRootStyle(settings);

  return (
    <div
      className={cn(
        "gdy-table",
        settings.fillHeight && "gdy-table-fill",
        showStickyHeader && "gdy-table-sticky",
        settings.thinScrollbars && "gdy-thin-scroll",
      )}
      style={rootStyle}
    >
      <div className="gdy-scope gdy-card">
        <Toolbar
          showSearch={flags.search}
          search={state.search}
          searchPlaceholder={settings.searchPlaceholder}
          onSearchChange={buildSearchChangeHandler(model)}
          showClearFilters={flags.filtering && state.hasActiveFilters}
          onClearFilters={state.clearFilters}
          showCreateButton={flags.createButton}
          createLabel={settings.createLabel}
          onCreate={settings.onCreate}
          groupSelector={buildGroupSelector(model)}
          {...buildArchivedToolbarProps(settings, state)}
          {...pickToolbarPassThrough(settings)}
        />

        <TableScrollArea model={model} />

        <TablePagination
          enabled={flags.pagination}
          totalRows={range.totalRows}
          from={range.from}
          to={range.to}
          label={settings.label}
          pageSize={paging.pageSize}
          pageSizeOptions={settings.pageSizeOptions}
          onPageSizeChange={paging.changePageSize}
          pageIndex={paging.pageIndex}
          pageCount={paging.pageCount}
          onPrevPage={() => paging.goToPage(paging.pageIndex - 1)}
          onNextPage={() => paging.goToPage(paging.pageIndex + 1)}
          selectTheme={settings.selectTheme}
        />
      </div>
    </div>
  );
}

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
} from "../shared/row-action";
export type {
  BuiltInActionId,
  BuiltInMenuRef,
  MenuItem,
  MenuLabel,
  MenuSeparator,
} from "../shared/menu-actions";
export type { SelectTheme } from "../shared/select-theme";
export type {
  ToolbarLayout,
  ToolbarSide,
} from "../shared/toolbar-layout";
export type {
  HeaderSelectConfig,
  SelectOption,
  ToggleDisplay,
  ToggleGroupConfig,
  ToggleOption,
} from "../shared/toolbar-controls";
