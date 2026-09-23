import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Filter,
} from "lucide-react";
import "./styles.css";
import { cn } from "../../lib/cn";
import {
  EMPTY_DATE_FILTER_STATE,
  hasDateFilterValue,
} from "../shared/date-utils";
import { useActiveFilters, useClickOutside } from "../shared/hooks";
import { DateFilterMenu, FilterMenu, Toolbar } from "../shared/toolbar";
import {
  DEFAULT_FEATURES,
  DEFAULT_PAGE_SIZES,
  GROUP_NONE_VALUE,
} from "./constants";
import { RowActionsMenu } from "./RowActionsMenu";
import { TablePagination } from "./TablePagination";
import { SimpleSelect } from "../ui/select";
import type {
  ArchivedViewMode,
  ColumnSortingState,
  DateFilterState,
  ColumnDefinition,
  DataTableProps,
  SortDirection,
} from "./types";
import {
  applyArchivedView,
  applyColumnFilters,
  applyColumnSorting,
  applyGlobalSearch,
  applyRowGrouping,
  buildGroupSelectOptions,
  computeColumnFilterOptions,
  findGroupForIndex,
  normalizeInputRows,
  normalizeToArray,
} from "./utils";

const resolveSortDirection = (
  sorting: ColumnSortingState | null,
  columnId: string,
): ColumnSortingState["direction"] | null => {
  return sorting?.id === columnId ? sorting.direction : null;
};

interface PageCountConfig {
  enabled: boolean;
  manual: boolean;
  serverPageCount?: number;
  serverRowCount?: number;
  localRowCount: number;
  pageSize: number;
}

const computePageCount = (config: PageCountConfig): number => {
  if (!config.enabled) return 1;
  if (config.manual) {
    if (config.serverPageCount !== undefined)
      return Math.max(1, config.serverPageCount);
    const total = config.serverRowCount ?? config.localRowCount;
    return Math.max(1, Math.ceil(total / config.pageSize));
  }
  return Math.max(1, Math.ceil(config.localRowCount / config.pageSize));
};

export function DataTable<TData>({
  columns,
  data,
  normalizeRow,
  getRowId,
  features,
  searchPlaceholder = "Buscar...",
  createLabel = "Nuevo",
  onCreate,
  onRowClick,
  rowActions,
  emptyMessage = "No se encontraron resultados",
  label = "elementos",
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  defaultPageSize = 50,
  manualPagination = false,
  serverRowCount,
  serverPageCount,
  onPaginationChange,
  onSearchChange,
  tableWrapClassName,
  tableMinHeightClassName = "gdy-table-min-h-md",
  tableMaxHeightClassName,
  scrollResetOnPageChange = true,
  stickyHeader = true,
  fillHeight = false,
  thinScrollbars = true,
  scrollbarColor,
  optionHoverColor,
  dateFilterRequireOperator = true,
  dateInputFormat = "dd/mm/yyyy",
  calendarMonthYearDropdown = true,
  calendarFromYear = new Date().getFullYear() - 100,
  calendarToYear = new Date().getFullYear() + 10,
  groupableColumnIds,
  defaultGroupBy = null,
  onGroupChange,
  groupSelectorLabel = "Agrupar por",
  groupNoneLabel = "Ninguno",
  groupEmptyValueLabel = "Sin valor",
  archivedView,
  viewSwitch,
  aiButton,
  toggleGroups,
  headerSelectors,
  toolbarLayout,
  selectTheme,
}: DataTableProps<TData>) {
  const flags = { ...DEFAULT_FEATURES, ...features };
  const rows = useMemo(
    () => normalizeInputRows(data, normalizeRow),
    [data, normalizeRow],
  );

  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<ColumnSortingState | null>(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [openFilterColumnId, setOpenFilterColumnId] = useState<string | null>(
    null,
  );
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [dateFilters, setDateFilters] = useState<
    Record<string, DateFilterState>
  >({});
  const [activeGroupBy, setActiveGroupBy] = useState<string | null>(() =>
    defaultGroupBy && (groupableColumnIds ?? []).includes(defaultGroupBy)
      ? defaultGroupBy
      : null,
  );
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    () => new Set(),
  );
  const [internalArchivedMode, setInternalArchivedMode] =
    useState<ArchivedViewMode>(archivedView?.defaultValue ?? "active");
  const archivedMode = archivedView?.value ?? internalArchivedMode;
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const handleArchivedModeChange = (next: ArchivedViewMode) => {
    if (archivedView?.value === undefined) setInternalArchivedMode(next);
    archivedView?.onChange?.(next);
  };

  const toggleColumnSort = (columnId: string, direction: SortDirection) =>
    setSorting((prev) =>
      prev?.id === columnId && prev.direction === direction
        ? null
        : { id: columnId, direction },
    );

  const groupOptions = useMemo(
    () =>
      (groupableColumnIds ?? [])
        .map((id) => columns.find((column) => column.id === id))
        .filter((column): column is ColumnDefinition<TData> => Boolean(column))
        .map((column) => ({ id: column.id, label: column.header })),
    [groupableColumnIds, columns],
  );

  const handleGroupByChange = (next: string | null) => {
    setActiveGroupBy(next);
    setCollapsedGroups(new Set());
    setPageIndex(0);
    onGroupChange?.(next);
  };

  const toggleGroup = (value: string) =>
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });

  useClickOutside(filterMenuRef, () => setOpenFilterColumnId(null));

  const computedFilterOptions = useMemo(
    () => computeColumnFilterOptions(columns, rows),
    [columns, rows],
  );

  const searchedRows = useMemo(
    () =>
      applyGlobalSearch(
        rows,
        columns,
        manualPagination ? "" : search,
        flags.search,
      ),
    [rows, columns, search, flags.search, manualPagination],
  );

  const archivedFilteredRows = useMemo(
    () =>
      archivedView
        ? applyArchivedView({
            rows: searchedRows,
            mode: archivedMode,
            getIsArchived: rowActions?.getIsArchived,
          })
        : searchedRows,
    [searchedRows, archivedMode, archivedView, rowActions],
  );

  const filteredRows = useMemo(
    () =>
      applyColumnFilters({
        rows: archivedFilteredRows,
        columns,
        filters,
        dateFilters,
        enabled: flags.filtering,
      }),
    [archivedFilteredRows, columns, filters, dateFilters, flags.filtering],
  );

  const sortedRows = useMemo(
    () =>
      applyColumnSorting({
        rows: filteredRows,
        columns,
        sorting,
        enabled: flags.sorting,
      }),
    [filteredRows, columns, sorting, flags.sorting],
  );

  const grouping = useMemo(
    () =>
      applyRowGrouping({
        rows: sortedRows,
        columns,
        activeGroupBy: flags.grouping ? activeGroupBy : null,
        emptyLabel: groupEmptyValueLabel,
      }),
    [sortedRows, columns, activeGroupBy, flags.grouping, groupEmptyValueLabel],
  );
  const flatRows = grouping.flatRows;

  useEffect(() => {
    if (manualPagination) return;
    setPageIndex(0);
  }, [
    search,
    filters,
    dateFilters,
    sorting,
    activeGroupBy,
    archivedMode,
    manualPagination,
  ]);

  const pageCount = computePageCount({
    enabled: flags.pagination,
    manual: manualPagination,
    serverPageCount,
    serverRowCount,
    localRowCount: flatRows.length,
    pageSize,
  });
  const safePageIndex = Math.min(pageIndex, pageCount - 1);

  useLayoutEffect(() => {
    if (!scrollResetOnPageChange) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.scrollTop = 0;
  }, [
    scrollResetOnPageChange,
    safePageIndex,
    pageSize,
    search,
    filters,
    dateFilters,
    sorting,
    activeGroupBy,
    archivedMode,
  ]);

  const pagedRows = useMemo(() => {
    if (!flags.pagination || manualPagination) return flatRows;
    const from = safePageIndex * pageSize;
    return flatRows.slice(from, from + pageSize);
  }, [flatRows, safePageIndex, pageSize, flags.pagination, manualPagination]);

  const pageStartIndex = flags.pagination ? safePageIndex * pageSize : 0;

  const hasActiveFilters = useActiveFilters(filters, dateFilters);

  const tableColumns = useMemo<ColumnDef<TData>[]>(() => {
    const visibleColumns = activeGroupBy
      ? columns.filter((column) => column.id !== activeGroupBy)
      : columns;

    const baseColumns: ColumnDef<TData>[] = visibleColumns.map((column) => ({
      id: column.id,
      size: column.width,
      header: column.header,
      cell: ({ row }) => {
        const value = normalizeToArray(column.accessor(row.original))[0] ?? "";
        const valueHighlight = column.valueHighlights?.[value];
        const canInlineEdit = Boolean(
          column.inlineEditOptions?.length && column.onInlineEdit,
        );
        const inlineOptions = column.inlineEditOptions ?? [];
        const inlineValueExists = inlineOptions.some(
          (option) => option.value === value,
        );

        return (
          <div className={cn("gdy-table-cell-content", valueHighlight?.className)}>
            {canInlineEdit ? (
              <div
                className="gdy-table-inline-select-wrap"
                onClick={(event) => event.stopPropagation()}
              >
                <SimpleSelect
                  options={inlineOptions}
                  value={inlineValueExists ? String(value) : ""}
                  onValueChange={(next) =>
                    column.onInlineEdit?.(row.original, next)
                  }
                  placeholder="Seleccionar..."
                  triggerClassName="h-7 w-full"
                  triggerStyle={valueHighlight?.style}
                  theme={selectTheme}
                />
              </div>
            ) : column.cell ? (
              column.cell(row.original)
            ) : (
              String(
                normalizeToArray(column.accessor(row.original)).join(", ") ||
                  "—",
              )
            )}
          </div>
        );
      },
    }));

    if (flags.rowActions && rowActions) {
      baseColumns.push({
        id: "_actions",
        size: 56,
        header: "",
        cell: ({ row }) => (
          <RowActionsMenu row={row.original} actions={rowActions} />
        ),
      });
    }

    return baseColumns;
  }, [columns, activeGroupBy, flags.rowActions, rowActions, selectTheme]);

  const table = useReactTable({
    data: pagedRows,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
  });

  const totalRows = manualPagination
    ? (serverRowCount ?? flatRows.length)
    : flatRows.length;
  const from = totalRows === 0 ? 0 : safePageIndex * pageSize + 1;
  const to = flags.pagination
    ? Math.min((safePageIndex + 1) * pageSize, totalRows)
    : totalRows;

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onSearchChange?.(value);
    if (manualPagination) setPageIndex(0);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPageIndex(0);
    onPaginationChange?.({ pageIndex: 0, pageSize: size });
  };

  const goToPage = (next: number) => {
    const target = Math.min(Math.max(0, next), pageCount - 1);
    setPageIndex(target);
    onPaginationChange?.({ pageIndex: target, pageSize });
  };

  const showStickyHeader =
    stickyHeader && (fillHeight || Boolean(tableMaxHeightClassName));

  const rootStyle = {
    ...(scrollbarColor ? { ["--gdy-scrollbar-thumb"]: scrollbarColor } : {}),
    ...(optionHoverColor ? { ["--gdy-option-hover-bg"]: optionHoverColor } : {}),
  } as CSSProperties;
  const emptyDateState: DateFilterState = dateFilterRequireOperator
    ? EMPTY_DATE_FILTER_STATE
    : { ...EMPTY_DATE_FILTER_STATE, op: "gt" };

  return (
    <div
      className={cn(
        "gdy-table",
        fillHeight && "gdy-table-fill",
        showStickyHeader && "gdy-table-sticky",
        thinScrollbars && "gdy-thin-scroll",
      )}
      style={rootStyle}
    >
      <div className="gdy-scope gdy-card">
        <Toolbar
          showSearch={flags.search}
          search={search}
          searchPlaceholder={searchPlaceholder}
          onSearchChange={handleSearchChange}
          showClearFilters={flags.filtering && hasActiveFilters}
          onClearFilters={() => {
            setFilters({});
            setDateFilters({});
          }}
          showCreateButton={flags.createButton}
          createLabel={createLabel}
          onCreate={onCreate}
          groupSelector={
            flags.grouping && groupOptions.length > 0
              ? {
                  options: buildGroupSelectOptions(
                    groupOptions,
                    groupSelectorLabel,
                    groupNoneLabel,
                  ),
                  value: activeGroupBy ?? GROUP_NONE_VALUE,
                  onChange: (value) =>
                    handleGroupByChange(value === GROUP_NONE_VALUE ? null : value),
                  ariaLabel: groupSelectorLabel,
                }
              : undefined
          }
          showArchivedView={
            Boolean(archivedView) && Boolean(rowActions?.getIsArchived)
          }
          archivedMode={archivedMode}
          onArchivedModeChange={handleArchivedModeChange}
          archivedViewLabel={archivedView?.label}
          archivedViewOptionLabels={archivedView?.optionLabels}
          viewSwitch={viewSwitch}
          aiButton={aiButton}
          toggleGroups={toggleGroups}
          headerSelectors={headerSelectors}
          toolbarLayout={toolbarLayout}
          selectTheme={selectTheme}
        />

        <div
          ref={wrapRef}
          className={cn(
            "gdy-table-wrap gdy-scroll",
            tableMinHeightClassName,
            tableMaxHeightClassName,
            tableWrapClassName,
          )}
        >
          <table className="gdy-table-grid">
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => {
                    const column = columns.find(
                      (item) => item.id === header.column.id,
                    );
                    if (!column) return <th key={header.id} />;

                    const sortDirection = resolveSortDirection(
                      sorting,
                      column.id,
                    );
                    const hasColumnFilter =
                      (filters[column.id]?.length ?? 0) > 0 ||
                      hasDateFilterValue(dateFilters[column.id]);

                    const openFilter = () => {
                      setOpenFilterColumnId((prev) =>
                        prev === column.id ? null : column.id,
                      );
                    };

                    const toggleSort = () => {
                      if (!flags.sorting || column.sortable === false) return;
                      setSorting((prev) => {
                        if (!prev || prev.id !== column.id) {
                          return { id: column.id, direction: "asc" };
                        }
                        if (prev.direction === "asc") {
                          return { id: column.id, direction: "desc" };
                        }
                        return null;
                      });
                    };

                    const handleHeaderAction = () => {
                      if (!flags.filtering || !column.filterable) {
                        toggleSort();
                        return;
                      }
                      openFilter();
                    };

                    return (
                      <th key={header.id} style={{ width: column.width }}>
                        <div className="gdy-table-head-cell">
                          <button
                            type="button"
                            className="gdy-table-head-trigger"
                            data-filtered={hasColumnFilter || undefined}
                            onClick={handleHeaderAction}
                          >
                            <span className="gdy-table-head-label" title={column.header}>
                              {column.header}
                            </span>
                            {hasColumnFilter && (
                              <Filter
                                size={12}
                                className="gdy-table-head-filter-icon"
                              />
                            )}
                            {flags.filtering && column.filterable && (
                              <ChevronDown
                                size={13}
                                className="gdy-table-head-arrow"
                              />
                            )}
                            {flags.sorting &&
                              column.sortable !== false &&
                              !column.filterable &&
                              (sortDirection === "asc" ? (
                                <ArrowUp size={13} />
                              ) : sortDirection === "desc" ? (
                                <ArrowDown size={13} />
                              ) : (
                                <ArrowUpDown size={13} />
                              ))}
                          </button>

                          {openFilterColumnId === column.id &&
                            flags.filtering &&
                            column.filterable && (
                              <div
                                className="gdy-table-menu-holder"
                                ref={filterMenuRef}
                              >
                                {column.type === "date" ? (
                                  <DateFilterMenu
                                    key={`${column.id}-${dateFilters[column.id]?.op ?? "gt"}-${dateFilters[column.id]?.date ?? ""}-${dateFilters[column.id]?.dateFrom ?? ""}-${dateFilters[column.id]?.dateTo ?? ""}`}
                                    state={
                                      dateFilters[column.id] ?? emptyDateState
                                    }
                                    emptyState={emptyDateState}
                                    dateInputFormat={dateInputFormat}
                                    calendarMonthYearDropdown={
                                      calendarMonthYearDropdown
                                    }
                                    calendarFromYear={calendarFromYear}
                                    calendarToYear={calendarToYear}
                                    onChange={(next) =>
                                      setDateFilters((prev) => ({
                                        ...prev,
                                        [column.id]: next,
                                      }))
                                    }
                                    onClose={() => setOpenFilterColumnId(null)}
                                    sortable={
                                      flags.sorting && column.sortable !== false
                                    }
                                    sortDirection={sortDirection}
                                    onSortAsc={() =>
                                      toggleColumnSort(column.id, "asc")
                                    }
                                    onSortDesc={() =>
                                      toggleColumnSort(column.id, "desc")
                                    }
                                    onSortClear={() =>
                                      setSorting((prev) =>
                                        prev?.id === column.id ? null : prev,
                                      )
                                    }
                                  />
                                ) : (
                                  <FilterMenu
                                    options={
                                      computedFilterOptions[column.id] ?? []
                                    }
                                    selected={filters[column.id] ?? []}
                                    onSelectedChange={(next) =>
                                      setFilters((prev) => ({
                                        ...prev,
                                        [column.id]: next,
                                      }))
                                    }
                                    sortable={
                                      flags.sorting && column.sortable !== false
                                    }
                                    sortDirection={sortDirection}
                                    onSortAsc={() =>
                                      toggleColumnSort(column.id, "asc")
                                    }
                                    onSortDesc={() =>
                                      toggleColumnSort(column.id, "desc")
                                    }
                                  />
                                )}
                              </div>
                            )}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td className="gdy-empty" colSpan={tableColumns.length}>
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
                          colSpan={tableColumns.length}
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
                          <td key={cell.id}>
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
          totalRows={totalRows}
          from={from}
          to={to}
          label={label}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageSizeChange={handlePageSizeChange}
          pageIndex={safePageIndex}
          pageCount={pageCount}
          onPrevPage={() => goToPage(safePageIndex - 1)}
          onNextPage={() => goToPage(safePageIndex + 1)}
          selectTheme={selectTheme}
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
