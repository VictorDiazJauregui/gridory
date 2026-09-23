import type { KanbanBoardView } from "./board-view";
import type {
  ColumnDefinition,
  KanbanBoardProps,
  KanbanGroupOption,
} from "./types";
import type { CardDragState } from "./use-card-drag";
import type { KanbanBoardState } from "./use-kanban-board-state";

type CardCallbacks<TData> = Pick<
  KanbanBoardProps<TData>,
  "renderCard" | "rowActions" | "onCardClick"
>;

type ColumnActions<TData> = Pick<
  KanbanBoardState<TData>,
  "drag" | "moveCard" | "resolveCardId"
>;

export interface KanbanCardSettings<TData> extends CardCallbacks<TData> {
  group: KanbanGroupOption<TData>;
  fields: ColumnDefinition<TData>[];
  rowActionsEnabled: boolean;
}

export interface KanbanColumnSettings<TData> extends ColumnActions<TData> {
  columnBodyMaxHeight: number;
  cardSettings: KanbanCardSettings<TData>;
}

export interface KanbanColumnProps<TData> extends KanbanColumnSettings<TData> {
  value: string;
  label: string;
  cards: TData[];
}

export interface KanbanCardProps<TData> extends KanbanCardSettings<TData> {
  card: TData;
  cardId: string;
  groupValue: string;
  drag: CardDragState;
}

export const buildColumnSettings = <TData>(
  state: KanbanBoardState<TData>,
  view: KanbanBoardView<TData>,
): KanbanColumnSettings<TData> => ({
  drag: state.drag,
  moveCard: state.moveCard,
  resolveCardId: state.resolveCardId,
  columnBodyMaxHeight: view.columnBodyMaxHeight,
  cardSettings: {
    group: state.selectedGroup,
    fields: view.fields,
    renderCard: view.renderCard,
    rowActions: view.rowActions,
    rowActionsEnabled: view.flags.rowActions,
    onCardClick: view.onCardClick,
  },
});
