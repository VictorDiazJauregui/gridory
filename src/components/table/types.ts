import type { KeyboardEvent, MouseEvent } from "react";
import type { ColumnDefinition, ColumnSortingState, DataInput } from "../shared/data-model";
import type { DataViewProps } from "../shared/data-view-props";

export type {
  AiButtonConfig,
  ArchivedViewConfig,
  ArchivedViewMode,
  CellHighlight,
  ColumnAlign,
  ColumnDefinition,
  ColumnOverflow,
  ColumnSortingState,
  DataInput,
  DateFilterOp,
  DateFilterState,
  DateInputFormat,
  FilterOption,
  Primitive,
  RowActions,
  SortDirection,
  ViewMode,
  ViewSwitchConfig,
} from "../shared/data-model";

export interface DataTableFeatures {
  search?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  pagination?: boolean;
  rowActions?: boolean;
  createButton?: boolean;
  grouping?: boolean;
}

export interface GroupHeader {
  value: string;
  label: string;
  count: number;
}

export interface RowGroupingResult<TData> {
  flatRows: TData[];
  headers: Map<number, GroupHeader>;
}

export interface ManualPaginationState {
  pageIndex: number;
  pageSize: number;
}

/**
 * Extra attributes for a row. Only `data-*` and `aria-*` names are accepted, so a row can
 * never lose its handlers, its class or the attributes the table writes itself.
 */
export type RowAttributes = Partial<
  Record<`data-${string}` | `aria-${string}`, string | number | boolean | undefined>
>;

/** Event `onRowClick` receives: the mouse click, or Enter on a focused row (`focusableRows`). */
export type RowClickEvent =
  | MouseEvent<HTMLTableRowElement>
  | KeyboardEvent<HTMLTableRowElement>;

/** Payload of `onVisibleRowsChange`: what the user is looking at. */
export interface VisibleRowsState<TData> {
  /** Rows of the current page in screen order, rows of collapsed groups included. */
  pageRows: TData[];
  /** Every row that passes search, archived view and filters, sorted (and grouped), before paging. */
  filteredRows: TData[];
  /** `filteredRows.length`; with `manualPagination`, `serverRowCount` when it is set. */
  totalRows: number;
}

/**
 * One class per part, added after the `gdy-*` hook of that part. `wrap` goes after
 * `tableMinHeightClassName`, `tableMaxHeightClassName` and `tableWrapClassName`, and `row` before
 * `getRowClassName`. `row` and `cell` are the data rows and cells; `empty` is the cell of the empty
 * state, which does not take `cell`.
 */
export interface DataTableClassNames {
  /** `gdy-table` */
  root?: string;
  /** `gdy-toolbar` */
  toolbar?: string;
  /** `gdy-table-wrap`, the rows scroll container */
  wrap?: string;
  /** `gdy-table-grid` */
  table?: string;
  /** `gdy-table-head-row` */
  headRow?: string;
  /** `gdy-table-head-cell` */
  headCell?: string;
  /** `gdy-table-row` */
  row?: string;
  /** `gdy-table-cell` */
  cell?: string;
  /** `gdy-table-pagination` */
  pagination?: string;
  /** `gdy-empty` */
  empty?: string;
}

export interface DataTableProps<TData> extends DataViewProps<TData> {
  columns: ColumnDefinition<TData>[];
  data: DataInput<TData>;
  normalizeRow?: (row: unknown, index: number) => TData;
  getRowId?: (row: TData, index: number) => string;
  features?: DataTableFeatures;
  /**
   * Fires when a data row is clicked, or with Enter on a focusable row. A click that starts in a
   * column with `ignoreRowClick` never fires it. With `getRowHref`, Ctrl/Cmd + click opens the
   * link instead.
   */
  onRowClick?: (row: TData, event: RowClickEvent) => void;
  /**
   * Turns a row into a link (`data-href`): Ctrl/Cmd + click, middle click and Ctrl/Cmd + Enter
   * open it in a new tab; a plain click or Enter call `onRowClick`, or navigate to it when there
   * is no `onRowClick`. `javascript:`, `data:` and `vbscript:` destinations are ignored.
   */
  getRowHref?: (row: TData) => string | undefined;
  /**
   * Lets the rows take the keyboard focus (Tab) and fire with Enter. Defaults to `false`, so a
   * table with `onRowClick` keeps the 1.0.1 behavior; rows with `getRowHref` are focusable unless
   * it is `false`. Rows with neither `onRowClick` nor `getRowHref` are never focusable.
   */
  focusableRows?: boolean;
  /**
   * Extra class(es) for a row, added after `gdy-table-row`. Called once per row and
   * render, so keep it cheap.
   */
  getRowClassName?: (row: TData) => string | undefined;
  /**
   * Extra `data-*` and `aria-*` attributes for a row. `undefined` omits an attribute and
   * so does `false` on `data-*` (on `aria-*` it renders `"false"`). Names the table
   * writes itself (`data-row-id`, `data-clickable`, `data-href`) are ignored. Called once per row and
   * render, so keep it cheap.
   */
  getRowAttributes?: (row: TData) => RowAttributes;
  label?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  /**
   * Server-side (manual) pagination. When true the table renders exactly the
   * `data` it receives (the current page) without slicing or counting locally,
   * and derives the page count from `serverPageCount`/`serverRowCount`. Global
   * search is delegated through `onSearchChange`. Column sort/filter still apply
   * over the current page. Omit it to keep the default client-side behavior.
   */
  manualPagination?: boolean;
  /** Total rows on the server; used to derive page count in manual mode. */
  serverRowCount?: number;
  /** Total pages on the server; overrides `serverRowCount` when provided. */
  serverPageCount?: number;
  /** Notifies page/pageSize changes so the consumer can refetch the page. */
  onPaginationChange?: (state: ManualPaginationState) => void;
  /**
   * Controlled sort. Pass it together with `onSortChange` to own the sort; `null` means no sort.
   * Leave it `undefined` to let the table keep the sort, as before. Switching between both
   * modes after mounting is not supported (a development warning reports it).
   */
  sorting?: ColumnSortingState | null;
  /**
   * Fires on every sort change made by the user (header click, filter menu, date "Clear"),
   * controlled or not, with the next sort or `null`.
   */
  onSortChange?: (sorting: ColumnSortingState | null) => void;
  /**
   * The server sorts the rows: the table never reorders `data`, it only reports the sort through
   * `onSortChange`. A sort change returns to the first page and calls `onPaginationChange` when the
   * page was not already the first one. Defaults to `false`.
   */
  manualSorting?: boolean;
  /** Notifies search changes so the consumer can run a server-side query. */
  onSearchChange?: (query: string) => void;
  /**
   * Reports the visible rows on mount and whenever search, filters, sort, grouping or
   * the page change them; never twice for the same result. With `manualPagination`,
   * `filteredRows` is the current page. New row objects in `data` count as a change.
   */
  onVisibleRowsChange?: (state: VisibleRowsState<TData>) => void;
  /**
   * Prints a clean table: without toolbar, pagination and row actions column, and without the
   * internal scroll that cuts rows. `"page"` prints the current page; `"all"` prints every filtered
   * row, with every group expanded, and goes back to the page when printing ends (with
   * `manualPagination` it prints the current page). Omit it to print as before.
   */
  printMode?: "page" | "all";
  /** Extra class(es) for the root element, added after `gdy-table` and its flags. */
  className?: string;
  classNames?: DataTableClassNames;
  tableWrapClassName?: string;
  tableMinHeightClassName?: string;
  /**
   * Extra class(es) applied to the rows scroll container to cap its height
   * (e.g. the built-in `gdy-table-max-h-sm|md|lg`), yielding a self-contained internal
   * scroll region without a height-constrained parent. Appended after
   * `tableMinHeightClassName` and before `tableWrapClassName`, so consumer
   * overrides still win. Optional; when omitted the layout is unchanged.
   */
  tableMaxHeightClassName?: string;
  /**
   * Resets the rows scroll container to the top on any visible-page change:
   * next/prev page, page-size change, or a search/filter/sort/group/archived
   * change that returns to the first page (including when already on page 0).
   * A no-op when the rows area does not scroll internally. Defaults to `true`.
   */
  scrollResetOnPageChange?: boolean;
  /**
   * Pins the header row to the top of the rows scroll container via native
   * `position: sticky`. Only takes effect together with an internal scroll region
   * (`fillHeight` or `tableMaxHeightClassName`), so it never alters consumers that
   * scroll the page. Defaults to `true`.
   */
  stickyHeader?: boolean;
  /**
   * Makes the table fill its parent's height: `.gdy-table`/`.gdy-card` become a flex
   * column and `.gdy-table-wrap` becomes the internal vertical scroller
   * (`flex:1; min-height:0; overflow-y:auto`). Requires a height-constrained
   * parent. Defaults to `false`.
   */
  fillHeight?: boolean;
  groupableColumnIds?: string[];
  defaultGroupBy?: string | null;
  onGroupChange?: (groupBy: string | null) => void;
  groupSelectorLabel?: string;
  groupNoneLabel?: string;
  groupEmptyValueLabel?: string;
}
