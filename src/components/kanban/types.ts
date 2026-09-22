import type { CSSProperties, ReactNode } from "react";
import type { ReusableRowAction } from "../shared/row-action";
import type { ReusableMenuItem } from "../shared/menu-actions";
import type { ReusableSelectTheme } from "../shared/select-theme";
import type { ReusableToolbarLayout } from "../shared/toolbar-layout";
import type {
  ReusableHeaderSelectConfig,
  ReusableToggleGroupConfig,
} from "../shared/toolbar-controls";

export type Primitive = string | number | boolean | null | undefined;
export type DateFilterOp = "gt" | "lt" | "bt";
/** Display and manual-entry mask for date filter inputs. */
export type DateInputFormat = "dd/mm/yyyy" | "dd-mm-yyyy" | "mm/dd/yyyy" | "mm-dd-yyyy";
export type SortDirection = "asc" | "desc";

export type ReusableTableInput<TData> =
  | TData[]
  | {
      data?: unknown;
      items?: unknown;
      results?: unknown;
      records?: unknown;
      payload?: { data?: unknown; items?: unknown; results?: unknown };
    };

export interface ReusableFilterOption {
  value: string;
  label: string;
}

export interface ReusableCellHighlight {
  className?: string;
  style?: CSSProperties;
}

export interface ReusableColumn<TData> {
  id: string;
  header: string;
  accessor: (row: TData) => Primitive | Primitive[];
  cell?: (row: TData) => ReactNode;
  type?: "text" | "number" | "date";
  sortable?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  filterOptions?: ReusableFilterOption[];
  width?: number;
  inlineEditOptions?: ReusableFilterOption[];
  onInlineEdit?: (row: TData, value: string) => void;
  valueHighlights?: Record<string, ReusableCellHighlight>;
}

export interface ReusableRowActions<TData> {
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
  /**
   * Extra menu actions beyond the built-ins. Each needs a unique `id` (validated
   * against `edit`/`archive`/`remove`/`history` and against other custom actions);
   * `placement` renders it before (`"top"`) or after (`"bottom"`, default) the
   * built-ins. No separators are inserted; use `menuActions` for full control.
   */
  customActions?: ReusableRowAction<TData>[];
  /**
   * Fully explicit, ordered menu composition. When provided it overrides
   * `customActions`: built-ins are referenced by id (`{ kind: "builtin", id }`),
   * separators (`{ kind: "separator", id }`) and headings
   * (`{ kind: "label", id, label }`) are placed only where you add them, and
   * every item's order and visibility is under your control.
   */
  menuActions?: ReusableMenuItem<TData>[];
}

export interface DateFilterState {
  /** Selected operator. Empty string means no operator has been chosen yet. */
  op: DateFilterOp | "";
  date: string;
  dateFrom: string;
  dateTo: string;
}

export interface ReusableKanbanGroupOption<TData> {
  id: string;
  label: string;
  accessor: (card: TData) => Primitive | Primitive[];
  setValue: (card: TData, nextValue: string) => TData;
  values?: ReusableFilterOption[];
}

export interface ReusableKanbanFeatures {
  search?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  createButton?: boolean;
  rowActions?: boolean;
  groupSelector?: boolean;
  dragAndDrop?: boolean;
}

export interface KanbanSortingState {
  id: string;
  direction: "asc" | "desc";
}

export type ArchivedViewMode = "all" | "active" | "archived";

export type ReusableViewMode = "table" | "kanban";

export interface ReusableViewSwitchConfig {
  active: ReusableViewMode;
  onChange: (view: ReusableViewMode) => void;
  tableLabel?: string;
  kanbanLabel?: string;
}

export interface ReusableAiButtonConfig {
  onClick: () => void;
  label?: string;
}

export interface ArchivedViewConfig {
  value?: ArchivedViewMode;
  defaultValue?: ArchivedViewMode;
  onChange?: (mode: ArchivedViewMode) => void;
  label?: string;
  optionLabels?: Partial<Record<ArchivedViewMode, string>>;
}

export interface ReusableKanbanMoveEvent<TData> {
  card: TData;
  updatedCard: TData;
  cardId: string;
  groupId: string;
  fromValue: string;
  toValue: string;
}

export interface ReusableKanbanCardClickEvent<TData> {
  card: TData;
  cardId: string;
  groupId: string;
  value: string;
}

export interface ReusableKanbanCardRenderContext<TData> {
  card: TData;
  groupId: string;
  groupValue: string;
}

export interface ReusableKanbanProps<TData> {
  fields: ReusableColumn<TData>[];
  data: ReusableTableInput<TData>;
  groups: ReusableKanbanGroupOption<TData>[];
  defaultGroupId: string;
  normalizeRow?: (row: unknown, index: number) => TData;
  getCardId: (card: TData, index: number) => string;
  features?: ReusableKanbanFeatures;
  rowActions?: ReusableRowActions<TData>;
  renderCard?: (
    card: TData,
    context: ReusableKanbanCardRenderContext<TData>,
  ) => ReactNode;
  onCardMove?: (event: ReusableKanbanMoveEvent<TData>) => void;
  onCardClick?: (event: ReusableKanbanCardClickEvent<TData>) => void;
  onGroupChange?: (groupId: string) => void;
  searchPlaceholder?: string;
  createLabel?: string;
  onCreate?: () => void;
  emptyMessage?: string;
  boardWrapClassName?: string;
  boardMinHeightClassName?: string;
  columnBodyMaxHeight?: number;
  archivedView?: ArchivedViewConfig;
  viewSwitch?: ReusableViewSwitchConfig;
  aiButton?: ReusableAiButtonConfig;
  toggleGroups?: ReusableToggleGroupConfig[];
  headerSelectors?: ReusableHeaderSelectConfig[];
  /**
   * Explicit toolbar composition. When provided it is authoritative: only the
   * listed slot ids render, on the given side and order (built-in ids: `search`,
   * `clearFilters`, `archived`, `group`, `ai`, `viewSwitch`, `create`; plus each
   * toggle/selector id). Omit it to keep the default layout, where each control
   * honors its own `position` (default `"right"`).
   */
  toolbarLayout?: ReusableToolbarLayout;
  /** Global styling for every styled select in the component (header + inline). */
  selectTheme?: ReusableSelectTheme;
  /**
   * Renders thin, light-gray scrollbars on every internal scroll area
   * (rows/board viewport, option lists, capped-height regions). Cosmetic only.
   * Defaults to `true`.
   */
  thinScrollbars?: boolean;
  /**
   * Thumb color for the thin scrollbars, injected as the
   * `--rkb-scrollbar-thumb` CSS variable. Any CSS color. Defaults to `#cbd5e1`.
   */
  scrollbarColor?: string;
  /**
   * Hover background for checklist option rows in the value filter menu,
   * injected as the `--rkb-option-hover-bg` CSS variable. Defaults to `#f1f5f9`.
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
}

export type KanbanFiltersState = Record<string, string[]>;
export type KanbanDateFiltersState = Record<string, DateFilterState>;
