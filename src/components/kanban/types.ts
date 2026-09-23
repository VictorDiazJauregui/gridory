import type { ReactNode } from "react";
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
  DateFilterState,
  DateInputFormat,
  FilterOption,
  Primitive,
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

/** A way of grouping cards into columns: reads and writes the grouping value. */
export interface KanbanGroupOption<TData> {
  id: string;
  label: string;
  accessor: (card: TData) => Primitive | Primitive[];
  setValue: (card: TData, nextValue: string) => TData;
  values?: FilterOption[];
}

export interface KanbanBoardFeatures {
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
  direction: SortDirection;
}

/** Payload of `onCardMove`: the card before and after the drop. */
export interface KanbanMoveEvent<TData> {
  card: TData;
  updatedCard: TData;
  cardId: string;
  groupId: string;
  fromValue: string;
  toValue: string;
}

/** Payload of `onCardClick`. */
export interface KanbanCardClickEvent<TData> {
  card: TData;
  cardId: string;
  groupId: string;
  value: string;
}

/** Second argument of `renderCard`. */
export interface KanbanCardRenderContext<TData> {
  card: TData;
  groupId: string;
  groupValue: string;
}

export interface KanbanBoardProps<TData> {
  fields: ColumnDefinition<TData>[];
  data: DataInput<TData>;
  groups: KanbanGroupOption<TData>[];
  defaultGroupId: string;
  normalizeRow?: (row: unknown, index: number) => TData;
  getCardId: (card: TData, index: number) => string;
  features?: KanbanBoardFeatures;
  rowActions?: RowActions<TData>;
  renderCard?: (
    card: TData,
    context: KanbanCardRenderContext<TData>,
  ) => ReactNode;
  onCardMove?: (event: KanbanMoveEvent<TData>) => void;
  onCardClick?: (event: KanbanCardClickEvent<TData>) => void;
  onGroupChange?: (groupId: string) => void;
  /**
   * Prefix of every option in the toolbar group selector and its accessible
   * label. Defaults to `"Agrupar por"`.
   */
  groupSelectorLabel?: string;
  searchPlaceholder?: string;
  createLabel?: string;
  onCreate?: () => void;
  emptyMessage?: string;
  boardWrapClassName?: string;
  boardMinHeightClassName?: string;
  columnBodyMaxHeight?: number;
  archivedView?: ArchivedViewConfig;
  viewSwitch?: ViewSwitchConfig;
  aiButton?: AiButtonConfig;
  toggleGroups?: ToggleGroupConfig[];
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
}

export type KanbanFiltersState = Record<string, string[]>;
export type KanbanDateFiltersState = Record<string, DateFilterState>;
