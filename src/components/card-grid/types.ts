import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import type { KanbanBoardLabels } from "../kanban/types";
import type { ColumnDefinition, DataInput } from "../shared/data-model";
import type { DataViewProps } from "../shared/data-view-props";
import type { DataViewStateProps } from "../shared/data-view-state-props";
import type { DataViewLabels } from "../shared/labels/data-view-labels";
import type { DataTableLabels, ManualPaginationState, VisibleRowsState } from "../table/types";

export type {
  AiButtonConfig,
  ArchivedViewConfig,
  ArchivedViewMode,
  ColumnDefinition,
  ColumnFiltersState,
  ColumnSortingState,
  DataInput,
  DateFilterOp,
  DateFilterState,
  DateInputFormat,
  FilterOption,
  Primitive,
  RowActions,
  SortDirection,
} from "../shared/data-model";
export type { ManualPaginationState, VisibleRowsState } from "../table/types";

export interface CardGridFeatures {
  search?: boolean;
  sorting?: boolean;
  filtering?: boolean;
  pagination?: boolean;
  rowActions?: boolean;
  createButton?: boolean;
}

/** Event `onRowClick` receives: the mouse click, or Enter on a focused card. */
export type CardClickEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

/**
 * One class per part, added after its `gdy-*` hook. The default card also keeps the kanban card hooks
 * (`gdy-kanban-card`, `gdy-kanban-card-*`), so it looks like a kanban card.
 */
export interface CardGridClassNames {
  /** `gdy-card-grid` */
  root?: string;
  /** `gdy-toolbar` */
  toolbar?: string;
  /** `gdy-kanban-filter-row`, rendered only when some column is filterable */
  filterRow?: string;
  /** `gdy-card-grid-list`, the grid of cards */
  list?: string;
  /** `gdy-card-grid-card`, default and custom cards alike */
  card?: string;
  /** `gdy-table-pagination` */
  pagination?: string;
  /** `gdy-empty` */
  empty?: string;
}

/** Every text of the card grid. Defaults in Spanish; pass the ones to replace with `labels`. */
export interface CardGridLabels
  extends DataViewLabels,
    Pick<DataTableLabels, "itemsName" | "showing" | "pageSize" | "pageOf" | "previousPage" | "nextPage">,
    Pick<KanbanBoardLabels, "untitledCard" | "cardFieldLabel" | "formatCardDate"> {}

export interface CardGridProps<TData> extends Omit<DataViewProps<TData>, "viewSwitch">, DataViewStateProps {
  /**
   * Replaces any text; omitted keys keep their Spanish default. The older single-text props
   * (`searchPlaceholder`, `createLabel`, `emptyMessage` and the `rowActions`, `archivedView` and `aiButton` labels) win.
   */
  labels?: Partial<CardGridLabels>;
  /** Same columns as `DataTable`: the first is the card title, the second its subtitle. */
  columns: ColumnDefinition<TData>[];
  data: DataInput<TData>;
  normalizeRow?: (row: unknown, index: number) => TData;
  /** Key and `data-row-id` of each card. Defaults to the position in `data`. */
  getRowId?: (row: TData, index: number) => string;
  features?: CardGridFeatures;
  /** Own content of each card; the ⋯ menu of `rowActions` is added under it. */
  renderCard?: (row: TData) => ReactNode;
  /**
   * Fires on a card click, or Enter on a focused card; never from a button or link inside it.
   * With `getRowHref`, Ctrl/Cmd + click opens the link instead.
   */
  onRowClick?: (row: TData, event: CardClickEvent) => void;
  /**
   * Turns a card into a link (`data-href`): Ctrl/Cmd + click, middle click and Ctrl/Cmd + Enter open it in a
   * new tab; a plain click or Enter call `onRowClick`, or navigate when there is none. Unsafe schemes are ignored.
   */
  getRowHref?: (row: TData) => string | undefined;
  /** Defaults to `[15, 25, 50, 100]`. */
  pageSizeOptions?: number[];
  /** Defaults to `25`. */
  defaultPageSize?: number;
  /**
   * Controlled page (0-based), paired with `onPaginationChange`, which also reports the first page the grid
   * picks after a search, filter, sort or archived-view change. `undefined` lets the grid keep it.
   */
  pageIndex?: number;
  /** Controlled page size; changing it from outside goes back to the first page. */
  pageSize?: number;
  /** The user changed the page or the page size. */
  onPaginationChange?: (state: ManualPaginationState) => void;
  /**
   * Reports the visible cards on mount and whenever search, filters, sort or the page change them; never
   * twice for the same result, never while `loading`.
   */
  onVisibleRowsChange?: (state: VisibleRowsState<TData>) => void;
  /** Extra class(es) for the root element, added after `gdy-card-grid` and its flags. */
  className?: string;
  classNames?: CardGridClassNames;
}
