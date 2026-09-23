import type { ReactNode } from "react";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import "./styles.css";
import { cn } from "../../lib/cn";
import { resolveRootStyle } from "../shared/root-style";
import { Toolbar } from "../shared/toolbar";
import {
  buildArchivedToolbarProps,
  pickToolbarPassThrough,
} from "../shared/toolbar/toolbar-props";
import { findGroupForIndex } from "./row-grouping";
import { TableHead } from "./TableHead";
import { TablePagination } from "./TablePagination";
import { buildGroupSelector, buildSearchChangeHandler } from "./toolbar-props";
import type { DataTableProps } from "./types";
import { useTableCore, type TableModel } from "./use-table-core";
import { useTableOptions } from "./use-table-options";

export const DataTable = <TData,>(props: DataTableProps<TData>) => {
  const core = useTableCore(props);
  const table = useReactTable(useTableOptions(core));
  const model: TableModel<TData> = { ...core, table };
  const { settings, state, grouping, paging } = core;
  const { flags, onRowClick, emptyMessage } = settings;
  const { activeGroupBy, collapsedGroups, toggleGroup } = state;
  const { wrapRef, pageStartIndex, range } = paging;
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

        <div
          ref={wrapRef}
          className={cn(
            "gdy-table-wrap gdy-scroll",
            settings.tableMinHeightClassName,
            settings.tableMaxHeightClassName,
            settings.tableWrapClassName,
          )}
        >
          <table className="gdy-table-grid">
            <TableHead model={model} />

            <tbody className="gdy-table-body">
              {table.getRowModel().rows.length === 0 ? (
                <tr className="gdy-table-empty-row">
                  <td
                    className="gdy-table-cell gdy-empty"
                    colSpan={table.options.columns.length}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.flatMap((row, indexInPage) => {
                  const absoluteIndex = pageStartIndex + indexInPage;
                  const groupHeader = activeGroupBy
                    ? grouping.headers.get(absoluteIndex)
                    : undefined;
                  const currentGroupValue = activeGroupBy
                    ? findGroupForIndex(grouping.headers, absoluteIndex)
                    : null;
                  const isCollapsed =
                    currentGroupValue !== null &&
                    collapsedGroups.has(currentGroupValue);

                  const elements: ReactNode[] = [];

                  if (groupHeader) {
                    const isHeaderCollapsed = collapsedGroups.has(
                      groupHeader.value,
                    );
                    elements.push(
                      <tr
                        className="gdy-table-group-row"
                        key={`__group__:${groupHeader.value}`}
                      >
                        <td
                          className="gdy-table-group-cell"
                          colSpan={table.options.columns.length}
                        >
                          <button
                            type="button"
                            className="gdy-table-group-toggle"
                            onClick={() => toggleGroup(groupHeader.value)}
                            aria-expanded={!isHeaderCollapsed}
                          >
                            <ChevronDown
                              size={14}
                              className="gdy-table-group-chevron"
                            />
                            <span className="gdy-table-group-label">
                              {groupHeader.label}
                            </span>
                            <span className="gdy-table-group-count">
                              {groupHeader.count}
                            </span>
                          </button>
                        </td>
                      </tr>,
                    );
                  }

                  if (!isCollapsed) {
                    elements.push(
                      <tr
                        key={row.id}
                        className="gdy-table-row"
                        data-clickable={onRowClick ? true : undefined}
                        onClick={
                          onRowClick
                            ? () => onRowClick(row.original)
                            : undefined
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="gdy-table-cell">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        ))}
                      </tr>,
                    );
                  }

                  return elements;
                })
              )}
            </tbody>
          </table>
        </div>

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
