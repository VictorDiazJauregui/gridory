import type { KanbanBoardView } from "../board-view";
import type {
  ColumnDefinition,
  KanbanBoardClassNames,
  KanbanBoardLabels,
  KanbanBoardProps,
  KanbanGroupOption,
} from "../types";
import type { CardDragState } from "../model/use-card-drag";
import type { KanbanBoardState } from "../model/use-kanban-board-state";
import type { MoveMenuState } from "../model/use-move-menu";
import type { ColumnCollapse } from "../model/use-collapsed-columns";
import type { ColumnHookSettings } from "./column-attributes";

type CardCallbacks<TData> = Pick<
  KanbanBoardProps<TData>,
  "renderCard" | "rowActions" | "onCardClick"
>;

type ColumnActions<TData> = Pick<
  KanbanBoardState<TData>,
  "drag" | "moveCard" | "resolveCardId" | "pendingIds"
>;

export interface KanbanCardSettings<TData> extends CardCallbacks<TData> {
  group: KanbanGroupOption<TData>;
  fields: ColumnDefinition<TData>[];
  rowActionsEnabled: boolean;
  cardClassName?: string;
  labels: KanbanBoardLabels;
  moveMenu: MoveMenuState;
}

export interface KanbanColumnSettings<TData> extends ColumnActions<TData> {
  groupId: string;
  renderColumnHeaderExtra?: KanbanBoardProps<TData>["renderColumnHeaderExtra"];
  renderColumnFooter?: KanbanBoardProps<TData>["renderColumnFooter"];
  collapse: ColumnCollapse;
  columnBodyMaxHeight: number;
  cardSettings: KanbanCardSettings<TData>;
  classNames?: KanbanBoardClassNames;
  columnHooks: ColumnHookSettings;
}

export interface KanbanColumnProps<TData> extends KanbanColumnSettings<TData> {
  value: string;
  label: string;
  cards: TData[];
  allCards: TData[];
}

export interface KanbanCardProps<TData> extends KanbanCardSettings<TData> {
  card: TData;
  cardId: string;
  groupValue: string;
  drag: CardDragState;
  /** The promise `onCardMove` returned for this card has not settled yet. */
  pending: boolean;
}

const buildCardSettings = <TData>(
  state: KanbanBoardState<TData>,
  view: KanbanBoardView<TData>,
): KanbanCardSettings<TData> => ({
  group: state.selectedGroup,
  fields: view.fields,
  renderCard: view.renderCard,
  rowActions: view.rowActions,
  rowActionsEnabled: view.flags.rowActions,
  onCardClick: view.onCardClick,
  cardClassName: view.classNames?.card,
  labels: view.labels,
  moveMenu: state.moveMenu,
});

export const buildColumnSettings = <TData>(
  state: KanbanBoardState<TData>,
  view: KanbanBoardView<TData>,
): KanbanColumnSettings<TData> => ({
  drag: state.drag,
  moveCard: state.moveCard,
  resolveCardId: state.resolveCardId,
  pendingIds: state.pendingIds,
  groupId: state.selectedGroup.id,
  renderColumnHeaderExtra: view.renderColumnHeaderExtra,
  renderColumnFooter: view.renderColumnFooter,
  collapse: state.collapse,
  columnBodyMaxHeight: view.columnBodyMaxHeight,
  cardSettings: buildCardSettings(state, view),
  classNames: view.classNames,
  columnHooks: view,
});
