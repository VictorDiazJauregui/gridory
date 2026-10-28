import type { ReactNode } from "react";
import type { ConsumerAttributes } from "../shared/attributes/consumer-attributes";
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

/** Argument of `canDrop`: the dragged card and the column it would land on. */
export interface KanbanDropContext<TData> {
  card: TData;
  cardId: string;
  /** `id` of the group the board is using, as in `onCardMove`. */
  groupId: string;
  fromValue: string;
  toValue: string;
}

/**
 * When the "Move to" action of the card menu is offered (`moveMenu`): `"auto"` while
 * `moveMenuMediaQuery` matches (a touch screen by default), `"always"` or `"never"`.
 */
export type KanbanMoveMenuMode = "auto" | "always" | "never";

/** Payload of `onVisibleCardsChange`: the cards the user is looking at. */
export interface KanbanVisibleCardsState<TData> {
  /** Cards that pass the search, the archived view and the filters, in sort order. */
  cards: TData[];
  /** Those cards per column value, one key per column on screen; `[]` for a column left empty. */
  byColumn: Record<string, TData[]>;
}

/** Argument of `renderColumnHeaderExtra`: one column of the current group and its cards. */
export interface KanbanColumnHeaderContext<TData> {
  /** Raw column value (`""` for the column of the cards without value). */
  value: string;
  /** Title shown in the column header. */
  label: string;
  /** `id` of the group the board is using, as in `onCardMove` and `onCardClick`. */
  groupId: string;
  /** Cards shown in the column: after the search, the archived view, the filters and the sort. */
  cards: TData[];
  /**
   * Every card of the column the board holds, in data order, including the ones the search, the
   * filters or the archived view hide.
   */
  allCards: TData[];
}

/** Argument of `renderColumnFooter`: the same column and cards as the header gets. */
export type KanbanColumnFooterContext<TData> = KanbanColumnHeaderContext<TData>;

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
 * Extra attributes for a column (`getColumnAttributes`). Only `data-*` and `aria-*` names are
 * accepted; the ones the board writes (`data-drop-target`, `data-column-value`,
 * `data-drop-disabled`, `data-collapsed`) are dropped.
 */
export type KanbanColumnAttributes = ConsumerAttributes;

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
  /** Card menu entry that opens the list of columns to move the card to. `"Mover a…"`. */
  moveTo: string;
  /** Announced to screen readers after a move from the menu. `` `Card movida a ${column}` ``. */
  cardMovedTo: (column: string) => string;
  /** Announced when that move is undone (`onCardMove` said no). `` `La card volvió a ${column}` ``. */
  cardMoveReverted: (column: string) => string;
  /** Accessible name and tooltip of the button that collapses a column. `` `Colapsar ${column}` ``. */
  collapseColumn: (column: string) => string;
  /** Accessible name and tooltip of the button that expands a collapsed column. `` `Expandir ${column}` ``. */
  expandColumn: (column: string) => string;
}

export interface KanbanBoardProps<TData> extends DataViewProps<TData> {
  /**
   * Replaces any text of the kanban; the keys you leave out keep their Spanish default. The older
   * single-text props (`searchPlaceholder`, `createLabel`, `emptyMessage`, `groupSelectorLabel`, the
   * `rowActions`, `archivedView`, `viewSwitch` and `aiButton` labels) win over their key when both are set.
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
  /**
   * A card was dropped on another column. Return `false`, or a promise that resolves to `false` or
   * rejects, to send the card back to its column; while the promise is pending the card carries
   * `data-pending` and `aria-busy` and cannot be dragged. Returning nothing keeps the move.
   */
  onCardMove?: (event: KanbanMoveEvent<TData>) => void | boolean | Promise<void | boolean>;
  /**
   * Receives the error of a promise from `onCardMove` that rejected, after the card is back in its
   * column. Without it the error is thrown again, as an unhandled rejection.
   */
  onCardMoveError?: (error: unknown, event: KanbanMoveEvent<TData>) => void;
  /**
   * Where a card may go; `false` keeps it in place. Asked on drag start (rejected columns get
   * `data-drop-disabled` until the drag ends), on every dragover and on drop, never for its own column.
   * Synchronous on purpose, as it runs many times per second: rules that need the server go in `onCardMove`.
   */
  canDrop?: (context: KanbanDropContext<TData>) => boolean;
  /**
   * Why `canDrop` rejected a column, shown under that column in the "Move to" menu and linked with
   * `aria-describedby`. Asked only for the columns `canDrop` rejected, and only when the menu opens.
   */
  getDropDisabledReason?: (context: KanbanDropContext<TData>) => string | undefined;
  /**
   * Adds "Move to" first in the card menu: a submenu with the other columns, for touch, keyboard and screen
   * readers, where dragging does not work. `"auto"` (default) shows it while `moveMenuMediaQuery` matches.
   * It goes through `canDrop` and `onCardMove` like a drop. Never shown when `features.dragAndDrop` is off.
   */
  moveMenu?: KanbanMoveMenuMode;
  /** Media query of `moveMenu="auto"`. Defaults to `"(pointer: coarse)"`; re-evaluated when it changes. */
  moveMenuMediaQuery?: string;
  onCardClick?: (event: KanbanCardClickEvent<TData>) => void;
  /**
   * The visible cards changed: on mount, and whenever the search, the filters, the archived view,
   * the group or a move changes which cards are shown. Never while `loading`; once more when it ends
   * if the cards changed.
   */
  onVisibleCardsChange?: (state: KanbanVisibleCardsState<TData>) => void;
  onGroupChange?: (groupId: string) => void;
  /**
   * Own content for each column header, rendered in `span.gdy-kanban-column-extra` between the title
   * and the count. Returning `null`, `undefined` or a boolean renders no container. Not called while
   * `loading`: the loading columns have no count either.
   */
  renderColumnHeaderExtra?: (context: KanbanColumnHeaderContext<TData>) => ReactNode;
  /**
   * Own content at the bottom of each column, in `div.gdy-kanban-column-footer`, under the cards and
   * outside their scroll (a "Load more" button, a total). Returning `null`, `undefined` or a boolean
   * renders no container. Not called while `loading`, nor for a collapsed column.
   */
  renderColumnFooter?: (context: KanbanColumnFooterContext<TData>) => ReactNode;
  /**
   * Adds a button to each column header that collapses the column into a narrow strip with its title
   * written vertically and its count; it still takes dropped cards. Defaults to `false`.
   */
  collapsibleColumns?: boolean;
  /**
   * Collapsed columns, by value (controlled). A value no column has, as when another group is active,
   * changes nothing. Read only while `collapsibleColumns` is on.
   */
  collapsedColumns?: string[];
  /** Columns collapsed at first, by value, when `collapsedColumns` is not passed. */
  defaultCollapsedColumns?: string[];
  /** The collapsed columns changed: receives the new list of values. */
  onCollapsedColumnsChange?: (values: string[]) => void;
  /** Prefix of each toolbar group selector option and its accessible label. Defaults to `"Agrupar por"`. */
  groupSelectorLabel?: string;
  /** Extra class(es) for the root element, added after `gdy-kanban` and its flags. */
  className?: string;
  classNames?: KanbanBoardClassNames;
  /**
   * Extra class(es) for one column, added after `gdy-kanban-column` and `classNames.column`. Receives
   * the raw column value (`""` for the column of the cards without value).
   */
  getColumnClassName?: (value: string) => string | undefined;
  /** Extra `data-*` and `aria-*` attributes for one column. Receives the raw column value. */
  getColumnAttributes?: (value: string) => KanbanColumnAttributes;
  boardWrapClassName?: string;
  boardMinHeightClassName?: string;
  columnBodyMaxHeight?: number;
}

export type KanbanFiltersState = Record<string, string[]>;
export type KanbanDateFiltersState = Record<string, DateFilterState>;
