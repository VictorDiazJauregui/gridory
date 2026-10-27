import type { ReactNode } from "react";
import type {
  ColumnDefinition,
  DataInput,
  DateFilterState,
  FilterOption,
  Primitive,
  SortDirection,
} from "../shared/data-model";
import type { DataViewProps } from "../shared/data-view-props";
import type { DataViewLabels } from "../shared/labels/data-view-labels";

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

/**
 * One class per part, added after the `gdy-*` hook of that part. `board` goes after
 * `boardMinHeightClassName` and `boardWrapClassName`. `empty` is the message of an empty board, not
 * the "Sin cards" box of an empty column.
 */
export interface KanbanBoardClassNames {
  /** `gdy-kanban` */
  root?: string;
  /** `gdy-toolbar` */
  toolbar?: string;
  /** `gdy-kanban-filter-row`, rendered only when some field is filterable */
  filterRow?: string;
  /** `gdy-kanban-board-wrap`, the columns scroll container */
  board?: string;
  /** `gdy-kanban-column` */
  column?: string;
  /** `gdy-kanban-column-head` */
  columnHead?: string;
  /** `gdy-kanban-column-body` */
  columnBody?: string;
  /** `gdy-kanban-card`, default and custom cards alike */
  card?: string;
  /** `gdy-empty` */
  empty?: string;
}

/** Every text of the kanban. Defaults in Spanish; pass the ones to replace with `labels`. */
export interface KanbanBoardLabels extends DataViewLabels {
  /** Box of a column without cards. `"Sin cards"`. */
  emptyColumn: string;
  /** Column and card group of the cards with an empty value. `"Sin valor"`. */
  emptyValue: string;
  /** Title of a default card whose first field is empty. `"Card"`. */
  untitledCard: string;
  /** Bold label before each field of a default card. `` `${header}:` ``. */
  cardFieldLabel: (header: string) => string;
  /**
   * Date field of a default card; receives the raw value (`"2026-03-01"`). Defaults to
   * `"01/03/2026"`, and returns any value without a `yyyy-mm-dd` start as it is.
   */
  formatCardDate: (value: string) => string;
}

export interface KanbanBoardProps<TData> extends DataViewProps<TData> {
  /**
   * Replaces any text of the kanban; the keys you leave out keep their Spanish default. The
   * older single-text props (`searchPlaceholder`, `createLabel`, `emptyMessage`,
   * `groupSelectorLabel`, the `rowActions`, `archivedView`, `viewSwitch` and `aiButton`
   * labels) win over their key when both are set.
   */
  labels?: Partial<KanbanBoardLabels>;
  fields: ColumnDefinition<TData>[];
  data: DataInput<TData>;
  groups: KanbanGroupOption<TData>[];
  defaultGroupId: string;
  normalizeRow?: (row: unknown, index: number) => TData;
  getCardId: (card: TData, index: number) => string;
  features?: KanbanBoardFeatures;
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
  /** Extra class(es) for the root element, added after `gdy-kanban` and its flags. */
  className?: string;
  classNames?: KanbanBoardClassNames;
  boardWrapClassName?: string;
  boardMinHeightClassName?: string;
  columnBodyMaxHeight?: number;
}

export type KanbanFiltersState = Record<string, string[]>;
export type KanbanDateFiltersState = Record<string, DateFilterState>;
