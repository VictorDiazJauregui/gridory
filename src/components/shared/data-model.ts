import type { CSSProperties, ReactNode } from "react";
import type { RowAction } from "./menu/row-action";
import type { MenuItem } from "./menu/menu-nodes";

/** Scalar values a column accessor may return. */
export type Primitive = string | number | boolean | null | undefined;

/** Operators available in date filters: greater than, less than, between. */
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
 * Rows accepted by `DataTable` and `KanbanBoard`: a plain array or a common
 * API envelope (`{ data | items | results | records | payload }`). Use
 * `normalizeRow` to map raw records to `TData`.
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

/** Horizontal alignment of a table column. */
export type ColumnAlign = "left" | "center" | "right";

/** What a table cell does with content wider than its column. */
export type ColumnOverflow = "ellipsis" | "wrap" | "visible";

export interface CellHighlight {
  className?: string;
  style?: CSSProperties;
}

/**
 * Field definition shared by `DataTable` (`columns`) and `KanbanBoard`
 * (`fields`): how to read, render, sort, search, filter and edit a value.
 */
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
   * Table only (the kanban ignores it). Aligns the cells and the header (title and sort
   * icon together, in that order) and renders `data-align` on the `th` and `td`. Omit it
   * to keep the default left alignment and the markup unchanged.
   */
  align?: ColumnAlign;
  /** Table only. Aligns the header apart from the cells; defaults to `align`. */
  headerAlign?: ColumnAlign;
  /**
   * Table only. No click, Ctrl/Cmd + click, middle click or Enter that starts inside this
   * column's cells triggers the row (`onRowClick` or `getRowHref`). For columns of selects,
   * links or text meant to be copied.
   */
  ignoreRowClick?: boolean;
  /**
   * Table only; the kanban ignores it. `"ellipsis"` (default) cuts the content on one line,
   * `"wrap"` breaks it over several lines and `"visible"` lets it overflow the cell. Leave it out
   * to keep the markup unchanged (no `data-overflow`).
   */
  overflow?: ColumnOverflow;
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
  /** Accessible name and tooltip of the ⋯ button, in the table and the kanban. Defaults to `"Opciones"`. */
  triggerLabel?: string;
  /**
   * Extra menu actions beyond the built-ins. Each needs a unique `id` (validated
   * against `edit`/`archive`/`remove`/`history` and against other custom actions);
   * `placement` renders it before (`"top"`) or after (`"bottom"`, default) the
   * built-ins, preserving array order within each group. No separators are
   * inserted; use `menuActions` for full control.
   */
  customActions?: RowAction<TData>[];
  /**
   * Fully explicit, ordered menu composition. When provided it overrides
   * `customActions`: built-ins are referenced by id (`{ kind: "builtin", id }`),
   * separators (`{ kind: "separator", id }`) and headings
   * (`{ kind: "label", id, label }`) are placed only where you add them, and
   * every item's order and visibility is under your control.
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
