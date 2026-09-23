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

export interface KanbanBoardProps<TData> extends DataViewProps<TData> {
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
  boardWrapClassName?: string;
  boardMinHeightClassName?: string;
  columnBodyMaxHeight?: number;
}

export type KanbanFiltersState = Record<string, string[]>;
export type KanbanDateFiltersState = Record<string, DateFilterState>;
