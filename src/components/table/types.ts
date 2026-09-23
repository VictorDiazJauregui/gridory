import type { SelectTheme } from "../shared/select-theme";
import type { ToolbarLayout } from "../shared/toolbar-layout";
import type {
  HeaderSelectConfig,
  ToggleGroupConfig,
} from "../shared/toolbar-controls";
import type {
  AiButtonConfig,
  ArchivedViewConfig,
  ColumnDefinition,
  DataInput,
  DateInputFormat,
  RowActions,
  SortDirection,
  ViewSwitchConfig,
} from "../shared/data-model";

export type {
  AiButtonConfig,
  ArchivedViewConfig,
  ArchivedViewMode,
  CellHighlight,
  ColumnDefinition,
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

export interface ColumnSortingState {
  id: string;
  direction: SortDirection;
}

export interface ManualPaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface DataTableProps<TData> {
  columns: ColumnDefinition<TData>[];
  data: DataInput<TData>;
  normalizeRow?: (row: unknown, index: number) => TData;
  getRowId?: (row: TData, index: number) => string;
  features?: DataTableFeatures;
  searchPlaceholder?: string;
  createLabel?: string;
  onCreate?: () => void;
  onRowClick?: (row: TData) => void;
  rowActions?: RowActions<TData>;
  emptyMessage?: string;
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
  /**
   * Renders thin, light-gray scrollbars on every internal scroll area
   * (rows/board viewport, option lists, capped-height regions). Cosmetic only.
   * Defaults to `true`.
   */
  thinScrollbars?: boolean;
  /**
   * Thumb color for the thin scrollbars, injected as the
   * `--gdy-scrollbar-thumb` CSS variable. Any CSS color. Defaults to the
   * `--gdy-input` token.
   */
  scrollbarColor?: string;
  /**
   * Hover background for checklist option rows in the value filter menu,
   * injected as the `--gdy-option-hover-bg` CSS variable. Defaults to a
   * subtle tint of the `--gdy-muted` token.
   */
  optionHoverColor?: string;
  /**
   * Requires the user to pick a date operator (greater/less/between) before the
   * calendar input appears; no operator is preselected. Set to `false` to
   * restore the legacy behavior where "greater than" is preselected.
   * Defaults to `true`.
   */
  dateFilterRequireOperator?: boolean;
  /**
   * Mask used by every date filter input for its placeholder, for rendering the
   * selected date, and for parsing manually typed text. Defaults to `"dd/mm/yyyy"`.
   */
  dateInputFormat?: DateInputFormat;
  /**
   * Shows month + year dropdowns in the filter calendar header instead of a
   * static month label, on the same row. Defaults to `true`.
   */
  calendarMonthYearDropdown?: boolean;
  /**
   * First selectable year in the calendar year dropdown.
   * Defaults to the current year minus 100.
   */
  calendarFromYear?: number;
  /**
   * Last selectable year in the calendar year dropdown.
   * Defaults to the current year plus 10.
   */
  calendarToYear?: number;
  groupableColumnIds?: string[];
  defaultGroupBy?: string | null;
  onGroupChange?: (groupBy: string | null) => void;
  groupSelectorLabel?: string;
  groupNoneLabel?: string;
  groupEmptyValueLabel?: string;
  archivedView?: ArchivedViewConfig;
  viewSwitch?: ViewSwitchConfig;
  aiButton?: AiButtonConfig;
  /**
   * Custom segmented controls for the toolbar. Each emits its own event; use them
   * to switch datasets/views beyond the table/kanban toggle. By default they sit
   * on the right (before the fixed controls); set each one's `position` to move it.
   */
  toggleGroups?: ToggleGroupConfig[];
  /**
   * Extra generic header selects (besides group-by and archived). Each fires its
   * own `onChange` so the consumer can react over the list. Default `position` is
   * `"right"`.
   */
  headerSelectors?: HeaderSelectConfig[];
  /**
   * Explicit toolbar composition. When provided it is authoritative: only the
   * listed slot ids render, on the given side and order (built-in ids: `search`,
   * `clearFilters`, `archived`, `group`, `ai`, `viewSwitch`, `create`; plus each
   * toggle/selector id). Omit it to keep the default layout, where each control
   * honors its own `position` (default `"right"`).
   */
  toolbarLayout?: ToolbarLayout;
  /** Global styling for every styled select in the component (header + inline). */
  selectTheme?: SelectTheme;
}
