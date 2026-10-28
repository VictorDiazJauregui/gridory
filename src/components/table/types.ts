import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import type { ConsumerAttributes } from "../shared/attributes/consumer-attributes";
import type { ColumnDefinition, ColumnFiltersState, ColumnSortingState, DataInput } from "../shared/data-model";
import type { DataViewProps } from "../shared/data-view-props";
import type { DataViewLabels } from "../shared/labels/data-view-labels";

export type {
  AiButtonConfig,
  ArchivedViewConfig,
  ArchivedViewMode,
  CellHighlight,
  ColumnAlign,
  ColumnDefinition,
  ColumnFiltersState,
  ColumnFooterContext,
  ColumnOverflow,
  ColumnPin,
  ColumnSortingState,
  HeaderTooltipPlacement,
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
  /** `false` renders no toolbar at all, as a table nested in a row detail may need. Defaults to `true`. */
  toolbar?: boolean;
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
export type RowAttributes = ConsumerAttributes;

/** Event `onRowClick` receives: the mouse click, or Enter on a focused row (`focusableRows`). */
export type RowClickEvent =
  | MouseEvent<HTMLTableRowElement>
  | KeyboardEvent<HTMLTableRowElement>;

/** Payload of `onVisibleRowsChange`. */
export interface VisibleRowsState<TData> {
  /** Rows of the current page in screen order, rows of collapsed groups included. */
  pageRows: TData[];
  /** Every row that passes search, archived view and filters, sorted (and grouped), before paging. */
  filteredRows: TData[];
  /** `filteredRows.length`; with `manualPagination`, `serverRowCount` when it is set. */
  totalRows: number;
}

/** Rows the header checkbox marks: the current page, or every row that passes search and filters. */
export type SelectAllScope = "page" | "filtered";

/** Row selection: the checkbox column, controlled with `selectedIds` or left to the table. */
export interface RowSelectionConfig<TData> {
  /** Controlled selection, as ids from `getRowId`; `undefined` lets the table keep it. */
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  /** Fires on every change made by the user, and when selected rows leave `data`. */
  onChange?: (selectedIds: string[]) => void;
  /** Defaults to `"page"`. With `manualPagination`, `"filtered"` acts as `"page"`. */
  selectAllScope?: SelectAllScope;
  /** `false` disables the row's checkbox and leaves the row out of the header checkbox. */
  isRowSelectable?: (row: TData) => boolean;
}

/** Second argument of `onColumnVisibilityChange`. */
export interface ColumnVisibilityDetails {
  /** Ids `responsiveColumns` hid for lack of room, in hiding order. */
  hiddenByPriority: string[];
}

/**
 * One class per part, added after its `gdy-*` hook. `wrap` goes after `tableMinHeightClassName`,
 * `tableMaxHeightClassName` and `tableWrapClassName`, and `row` before `getRowClassName`. `row` and
 * `cell` are the data rows and cells; `empty` is the empty-state cell, which does not take `cell`.
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
  /** `gdy-table-foot`, the totals row group (`tfoot`) */
  foot?: string;
  /** `gdy-table-foot-cell` */
  footCell?: string;
}

/** Every text of the table. Defaults in Spanish; pass the ones to replace with `labels`. */
export interface DataTableLabels extends DataViewLabels {
  /** Noun of the pagination summary. `"elementos"`. */
  itemsName: string;
  /** Pagination summary. `"0 elementos"` with no rows, otherwise `"Mostrando 1–25 de 53 elementos"`. */
  showing: (range: { from: number; to: number; total: number; itemsName: string }) => string;
  /** Text and accessible name of the page size selector. `"Elementos por página"`. */
  pageSize: string;
  /** Page position; `page` is `0` when there are no rows. `"Página 1 de 3"`. */
  pageOf: (page: number, count: number) => string;
  /** Accessible name of the previous page arrow. `"Página anterior"`. */
  previousPage: string;
  /** Accessible name of the next page arrow. `"Página siguiente"`. */
  nextPage: string;
  /** Placeholder of an inline `select` cell with no value. `"Seleccionar..."`. */
  inlineSelectPlaceholder: string;
  /** Group selector option that removes the grouping. `"Ninguno"`. */
  groupNone: string;
  /** Group of the rows with an empty value. `"Sin valor"`. */
  groupEmptyValue: string;
  /** Accessible name of a row checkbox. `"Seleccionar fila"`. */
  selectRow: string;
  /** Accessible name of the header checkbox with `selectAllScope: "page"`. `"Seleccionar las filas de la página"`. */
  selectPageRows: string;
  /** Accessible name of the header checkbox with `selectAllScope: "filtered"`. `"Seleccionar todas las filas filtradas"`. */
  selectFilteredRows: string;
  /** Printed instead of a checked row checkbox (`printMode`). `"Sí"`. */
  printSelected: string;
  /** Printed instead of an unchecked row checkbox (`printMode`). `"No"`. */
  printNotSelected: string;
  /** Printed instead of the header checkbox (`printMode`). `"Seleccionada"`. */
  printSelectionHeader: string;
  /** Accessible name of the header help icon (`headerTooltip`). `"Ayuda sobre Monto"`. */
  columnHelp: (header: string) => string;
  /** Accessible name of a row's expand button (`renderExpandedRow`); `aria-expanded` tells its state. `"Mostrar detalle"`. */
  expandRow: string;
}

export interface DataTableProps<TData> extends DataViewProps<TData> {
  /**
   * Replaces any text; omitted keys keep their Spanish default. Older single-text props win over their key:
   * `searchPlaceholder`, `createLabel`, `emptyMessage`, `label`, `groupSelectorLabel`, `groupNoneLabel`,
   * `groupEmptyValueLabel`, and the `rowActions`, `archivedView`, `viewSwitch` and `aiButton` labels.
   */
  labels?: Partial<DataTableLabels>;
  columns: ColumnDefinition<TData>[];
  data: DataInput<TData>;
  normalizeRow?: (row: unknown, index: number) => TData;
  getRowId?: (row: TData, index: number) => string;
  features?: DataTableFeatures;
  /**
   * Adds a checkbox column before the data columns. Requires `getRowId` (`MissingRowIdError` otherwise);
   * ids that leave `data` are dropped, except with `manualPagination`, where the app owns them.
   */
  rowSelection?: RowSelectionConfig<TData>;
  /**
   * Adds an expand button column and, under each open row, a full-width detail with this content. Requires
   * `getRowId` (`MissingRowIdError` otherwise). The detail is not a row: paging and totals ignore it.
   */
  renderExpandedRow?: (row: TData) => ReactNode;
  /** Controlled open rows, as ids from `getRowId`; `undefined` lets the table keep them. */
  expandedRowIds?: string[];
  defaultExpandedRowIds?: string[];
  /** Fires when the user opens or closes a row, controlled or not. */
  onExpandedChange?: (expandedRowIds: string[]) => void;
  /** `false` leaves the row without expand button. Defaults to every row. */
  canExpandRow?: (row: TData) => boolean;
  /** Columns the app shows (`true`) or removes (`false`); a column not listed is shown. Always wins over `priority`. */
  columnVisibility?: Record<string, boolean>;
  /**
   * Reports, on mount and on every change, which columns are on screen (`true`/`false` per column id) and which
   * `responsiveColumns` hid. Do not feed it back into `columnVisibility`: that would pin the hidden ones.
   */
  onColumnVisibilityChange?: (visibility: Record<string, boolean>, details: ColumnVisibilityDetails) => void;
  /**
   * Hides `hideable` and `priority` columns, as the container shrinks, until the rest fits without horizontal
   * scroll. A column counts its `width`, or the measured width of its title. Defaults to `false`.
   */
  responsiveColumns?: boolean;
  /**
   * Fires on a data row click, or Enter on a focusable row; never from a column with `ignoreRowClick`.
   * With `getRowHref`, Ctrl/Cmd + click opens the link instead.
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
  /** Extra class(es) for a row, after `gdy-table-row`. Called once per row and render: keep it cheap. */
  getRowClassName?: (row: TData) => string | undefined;
  /**
   * Extra `data-*` and `aria-*` attributes for a row. `undefined` omits one, and so does `false` on
   * `data-*` (on `aria-*` it renders `"false"`). Names the table writes (`data-row-id`, `data-clickable`,
   * `data-href`) are ignored. Called once per row and render, so keep it cheap.
   */
  getRowAttributes?: (row: TData) => RowAttributes;
  label?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  /**
   * Server-side pagination: `data` is the current page, rendered without slicing or counting, and the page
   * count comes from `serverPageCount`/`serverRowCount`. Global search goes through `onSearchChange`;
   * column sort and filters still apply over the current page. Omit it for client-side pagination.
   */
  manualPagination?: boolean;
  /** Total rows on the server; used to derive page count in manual mode. */
  serverRowCount?: number;
  /** Total pages on the server; overrides `serverRowCount` when provided. */
  serverPageCount?: number;
  /** Notifies page/pageSize changes so the consumer can refetch the page. */
  onPaginationChange?: (state: ManualPaginationState) => void;
  /**
   * Controlled page (0-based), paired with `onPaginationChange`. Every page the table picks itself (the
   * first after a search, filter, sort, grouping or archived-view change, or the last when out of range)
   * is reported there, except the out-of-range fix while `loading`. `undefined` lets the table keep it.
   */
  pageIndex?: number;
  /**
   * Controlled page size; `defaultPageSize` is ignored while it is set. Changing it from outside goes
   * back to the first page. A size missing from `pageSizeOptions` is added to the select while it is
   * active. Leave it `undefined` to let the table keep the size.
   */
  pageSize?: number;
  /**
   * Controlled search query shown in the search box. Pass it together with `onSearchChange`, which
   * only reports what the user types (not the changes of this prop).
   */
  search?: string;
  /**
   * Milliseconds without typing before calling `onSearchChange` (with `manualPagination`, the return to the
   * first page waits too, so both arrive together). The box and the local search respond at once.
   * Omit it (or `0`) to report every keystroke.
   */
  searchDebounceMs?: number;
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
  /**
   * Controlled column filters (value and date filters). Pass it together with `onFiltersChange` to
   * own them. Leave it `undefined` to let the table keep them, as before.
   */
  columnFilters?: ColumnFiltersState;
  /**
   * Fires when the user changes the active filters (a value menu, a date menu, "Clear filters"),
   * controlled or not. It receives only the active ones: no column with an empty selection and no
   * incomplete date filter.
   */
  onFiltersChange?: (filters: ColumnFiltersState) => void;
  /**
   * The server filters: `data` is never filtered, only reported via `onFiltersChange`; a change returns to
   * the first page (via `onPaginationChange` when needed). Without `filterOptions`, a column menu lists the
   * loaded rows' values plus the selected ones. Defaults to `false`.
   */
  manualFiltering?: boolean;
  /** Notifies search changes so the consumer can run a server-side query. */
  onSearchChange?: (query: string) => void;
  /**
   * Reports the visible rows on mount and whenever search, filters, sort, grouping or
   * the page change them; never twice for the same result. With `manualPagination`,
   * `filteredRows` is the current page. New row objects in `data` count as a change.
   */
  onVisibleRowsChange?: (state: VisibleRowsState<TData>) => void;
  /**
   * Prints without toolbar, pagination, actions column or the internal scroll that cuts rows. `"page"`
   * prints the current page; `"all"` every filtered row with its groups expanded, then returns to the page
   * (with `manualPagination`, only the current page). Omit it to print as before.
   */
  printMode?: "page" | "all";
  /** Extra class(es) for the root element, added after `gdy-table` and its flags. */
  className?: string;
  classNames?: DataTableClassNames;
  tableWrapClassName?: string;
  tableMinHeightClassName?: string;
  /**
   * Class(es) that cap the height of the rows scroll container (e.g. the built-in `gdy-table-max-h-sm|md|lg`)
   * for an internal scroll without a height-constrained parent. Goes after `tableMinHeightClassName` and
   * before `tableWrapClassName`, so consumer overrides still win.
   */
  tableMaxHeightClassName?: string;
  /**
   * Scrolls the rows container to the top on any visible-page change: next/prev, page size, or a
   * search/filter/sort/group/archived change back to the first page (even from page 0). Defaults to `true`.
   */
  scrollResetOnPageChange?: boolean;
  /**
   * Sticks the header row to the top of the rows scroll container, only with an internal scroll region
   * (`fillHeight` or `tableMaxHeightClassName`), so a table that scrolls with the page is unaffected.
   * Defaults to `true`.
   */
  stickyHeader?: boolean;
  /**
   * Fills the parent's height: `.gdy-table`/`.gdy-card` become a flex column and `.gdy-table-wrap` the
   * internal vertical scroller. Requires a height-constrained parent. Defaults to `false`.
   */
  fillHeight?: boolean;
  groupableColumnIds?: string[];
  defaultGroupBy?: string | null;
  onGroupChange?: (groupBy: string | null) => void;
  groupSelectorLabel?: string;
  groupNoneLabel?: string;
  groupEmptyValueLabel?: string;
}
