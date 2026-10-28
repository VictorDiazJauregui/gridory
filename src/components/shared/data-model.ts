import type { CSSProperties, ReactNode } from "react";
import type { RowActionEntry } from "./menu/row-action";
import type { MenuItem } from "./menu/menu-nodes";

export type Primitive = string | number | boolean | null | undefined;

/** Date filter operators: greater than, less than, between. */
export type DateFilterOp = "gt" | "lt" | "bt";

/** Display and manual-entry mask for date filter inputs. */
export type DateInputFormat =
  | "dd/mm/yyyy"
  | "dd-mm-yyyy"
  | "mm/dd/yyyy"
  | "mm-dd-yyyy";

export type SortDirection = "asc" | "desc";

export interface ColumnSortingState {
  id: string;
  direction: SortDirection;
}

/**
 * A plain array or a common API envelope (`{ data | items | results | records | payload }`).
 * Use `normalizeRow` to map raw records to `TData`.
 */
export type DataInput<TData> =
  | TData[]
  | {
      data?: unknown;
      items?: unknown;
      results?: unknown;
      records?: unknown;
      payload?: { data?: unknown; items?: unknown; results?: unknown };
    };

export interface FilterOption {
  value: string;
  label: string;
}

export type ColumnAlign = "left" | "center" | "right";

export type ColumnOverflow = "ellipsis" | "wrap" | "visible";

/** Table only. Edge a column sticks to while the rows scroll sideways. */
export type ColumnPin = "left" | "right";

/** Where the header help icon sits: left or right of the title, or at the cell edge opposite the title. */
export type HeaderTooltipPlacement = "before" | "after" | "edge";

export interface CellHighlight {
  className?: string;
  style?: CSSProperties;
}

/**
 * What a column `footer` receives: the same rows `onVisibleRowsChange` reports. With
 * `manualPagination`, `filteredRows` is the current page and `totalRows` is `serverRowCount`.
 */
export interface ColumnFooterContext<TData> {
  /** Rows of the current page in screen order, rows of collapsed groups included. */
  pageRows: TData[];
  /** Every row that passes search, archived view and filters, sorted (and grouped), before paging. */
  filteredRows: TData[];
  /** `filteredRows.length`; with `manualPagination`, `serverRowCount` when it is set. */
  totalRows: number;
}

/** Field definition shared by `DataTable` (`columns`) and `KanbanBoard` (`fields`). */
export interface ColumnDefinition<TData> {
  id: string;
  header: string;
  accessor: (row: TData) => Primitive | Primitive[];
  cell?: (row: TData) => ReactNode;
  type?: "text" | "number" | "date";
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  filterOptions?: FilterOption[];
  width?: number;
  inlineEditOptions?: FilterOption[];
  onInlineEdit?: (row: TData, value: string) => void;
  valueHighlights?: Record<string, CellHighlight>;
  /**
   * Table only. Aligns the cells and the header (title, then sort icon) and renders `data-align` on
   * `th` and `td`. Omit it to keep the default left alignment and the markup unchanged.
   */
  align?: ColumnAlign;
  /** Table only. Aligns the header apart from the cells; defaults to `align`. */
  headerAlign?: ColumnAlign;
  /**
   * Table only. A click (plain, Ctrl/Cmd or middle) or Enter starting in this column's cells does not
   * trigger the row (`onRowClick`, `getRowHref`). For columns of selects, links or text to copy.
   */
  ignoreRowClick?: boolean;
  /**
   * Table only. `"ellipsis"` (default) cuts the content on one line, `"wrap"` breaks it over lines and
   * `"visible"` lets it overflow the cell. Omit it to keep the markup unchanged (no `data-overflow`).
   */
  overflow?: ColumnOverflow;
  /**
   * Table only. This column's cell in the totals row (`tfoot.gdy-table-foot`), computed from the rows
   * on screen. The totals row only renders when a visible column has `footer`.
   */
  footer?: (context: ColumnFooterContext<TData>) => ReactNode;
  /**
   * Table only. With `printMode`, the cell prints this text instead of its content (a switch as "Yes"/"No").
   * Omit it to print the content, as on screen.
   */
  printValue?: (row: TData) => string;
  /** Table only. With `responsiveColumns`, the column may hide when it does not fit. `priority` implies it. */
  hideable?: boolean;
  /**
   * Table only. With `responsiveColumns`, the lowest number hides first. Hideable columns without one hide
   * before every numbered column, right to left.
   */
  priority?: number;
  /** Table only. Help text behind a "?" next to the title; it opens on hover, focus, tap or click. */
  headerTooltip?: string;
  /** Table only. Defaults to `"after"`, or `"before"` with a right-aligned header. */
  headerTooltipPlacement?: HeaderTooltipPlacement;
  /**
   * Table only. Replaces the visible title in the header; `header` stays its accessible name and the text of the
   * menus, the group selector and the kanban.
   */
  headerContent?: ReactNode;
  /**
   * Table only. Keeps the column at that edge while the rows scroll sideways; it moves next to the other pinned
   * columns of its side, in declaration order. Needs `width` (`PinnedColumnWidthError` otherwise).
   */
  pin?: ColumnPin;
}

/** Built-in and custom actions available per row (table) or per card (kanban). */
export interface RowActions<TData> {
  edit?: boolean;
  archive?: boolean;
  remove?: boolean;
  history?: boolean;
  onEdit?: (row: TData) => void;
  onArchive?: (row: TData) => void;
  onArchiveToggle?: (row: TData) => void;
  onRemove?: (row: TData) => void;
  onHistory?: (row: TData) => void;
  getIsArchived?: (row: TData) => boolean;
  archiveLabel?: string;
  unarchiveLabel?: string;
  deleteLabel?: string;
  editLabel?: string;
  historyLabel?: string;
  /** Table only. Header text of the actions column. Defaults to none (an empty header). */
  columnLabel?: string;
  /**
   * Table only. Alignment of the actions column header and button. Defaults to `"right"`;
   * `data-align` is rendered only when `align` or `columnLabel` is set.
   */
  align?: ColumnAlign;
  /**
   * Table only. Keeps the actions column at the right edge while the rows scroll sideways (it is pinned anyway
   * when a column has `pin: "right"`). Pinned, it takes 56px, or 96px with `columnLabel`.
   */
  pinned?: boolean;
  /** Accessible name and tooltip of the ⋯ button, in the table and the kanban. Defaults to `"Opciones"`. */
  triggerLabel?: string;
  /**
   * Extra menu actions; every `id`, submenu ones included, must differ from the built-ins and each other.
   * `placement` puts each before (`"top"`) or after (`"bottom"`, default) the built-ins, in array order.
   * An entry with `items` opens a submenu. No separators are added; use `menuActions` for full control.
   */
  customActions?: RowActionEntry<TData>[];
  /**
   * Explicit, ordered menu that overrides `customActions`: built-ins go by id (`{ kind: "builtin", id }`),
   * and separators (`{ kind: "separator", id }`) and headings (`{ kind: "label", id, label }`) appear
   * only where you add them.
   */
  menuActions?: MenuItem<TData>[];
}

export interface DateFilterState {
  /** Selected operator. Empty string means no operator has been chosen yet. */
  op: DateFilterOp | "";
  date: string;
  dateFrom: string;
  dateTo: string;
}

export interface ColumnFiltersState {
  /** Selected values, by column id. */
  values: Record<string, string[]>;
  /** Date filter, by column id. */
  dates: Record<string, DateFilterState>;
}

export type ArchivedViewMode = "all" | "active" | "archived";

export interface ArchivedViewConfig {
  value?: ArchivedViewMode;
  defaultValue?: ArchivedViewMode;
  onChange?: (mode: ArchivedViewMode) => void;
  label?: string;
  optionLabels?: Partial<Record<ArchivedViewMode, string>>;
}

export type ViewMode = "table" | "kanban";

/** Table/kanban toggle rendered in the toolbar; the consumer owns the active view. */
export interface ViewSwitchConfig {
  active: ViewMode;
  onChange: (view: ViewMode) => void;
  tableLabel?: string;
  kanbanLabel?: string;
}

/** AI assistant button rendered in the toolbar; the consumer opens the sidebar. */
export interface AiButtonConfig {
  onClick: () => void;
  label?: string;
}
