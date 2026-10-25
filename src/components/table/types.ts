import type { ColumnDefinition, DataInput } from "../shared/data-model";
import type { DataViewProps } from "../shared/data-view-props";

export type {
  AiButtonConfig,
  ArchivedViewConfig,
  ArchivedViewMode,
  CellHighlight,
  ColumnDefinition,
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

/** Payload of `onVisibleRowsChange`: what the user is looking at. */
export interface VisibleRowsState<TData> {
  /** Rows of the current page in screen order, rows of collapsed groups included. */
  pageRows: TData[];
  /** Every row that passes search, archived view and filters, sorted (and grouped), before paging. */
  filteredRows: TData[];
  /** `filteredRows.length`; with `manualPagination`, `serverRowCount` when it is set. */
  totalRows: number;
}

export interface DataTableProps<TData> extends DataViewProps<TData> {
  columns: ColumnDefinition<TData>[];
  data: DataInput<TData>;
  normalizeRow?: (row: unknown, index: number) => TData;
  getRowId?: (row: TData, index: number) => string;
  features?: DataTableFeatures;
  onRowClick?: (row: TData) => void;
  /**
   * Extra class(es) for a row, added after `gdy-table-row`. Called once per row and
   * render, so keep it cheap.
   */
  getRowClassName?: (row: TData) => string | undefined;
  /**
   * Extra `data-*` and `aria-*` attributes for a row. `undefined` omits an attribute and
   * so does `false` on `data-*` (on `aria-*` it renders `"false"`). Names the table
   * writes itself (`data-row-id`, `data-clickable`) are ignored. Called once per row and
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
  /** Notifies search changes so the consumer can run a server-side query. */
  onSearchChange?: (query: string) => void;
  /**
   * Reports the visible rows on mount and whenever search, filters, sort, grouping or
   * the page change them; never twice for the same result. With `manualPagination`,
   * `filteredRows` is the current page. New row objects in `data` count as a change.
   */
  onVisibleRowsChange?: (state: VisibleRowsState<TData>) => void;
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
