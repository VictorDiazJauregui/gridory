import "./styles.css";
import { cn } from "../../lib/cn";
import { buildLoadingRootAttributes } from "../shared/loading/loading-state";
import { resolveRootStyle } from "../shared/root-style";
import { useResolvedLabels } from "../shared/labels/use-resolved-labels";
import { applyBoardDefaults, assertGroupConfiguration, type KanbanBoardView } from "./board-view";
import { KanbanBoardBody } from "./board/KanbanBoardBody";
import { KanbanMoveAnnouncer } from "./board/KanbanMoveAnnouncer";
import { KANBAN_BOARD_LABELS } from "./labels";
import { KanbanFilterRow } from "./toolbar/KanbanFilterRow";
import { KanbanToolbar } from "./toolbar/KanbanToolbar";
import type { KanbanBoardProps } from "./types";
import { useKanbanBoardState } from "./model/use-kanban-board-state";

const resolveRootClassName = <TData,>(view: KanbanBoardView<TData>) =>
  cn("gdy-kanban", view.thinScrollbars && "gdy-thin-scroll", view.className, view.classNames?.root);

export const KanbanBoard = <TData,>(props: KanbanBoardProps<TData>) => {
  assertGroupConfiguration(props.groups, props.defaultGroupId);
  const view = applyBoardDefaults(props, useResolvedLabels(KANBAN_BOARD_LABELS, props.labels));
  const state = useKanbanBoardState(view);
  return (
    <div
      className={resolveRootClassName(view)}
      style={resolveRootStyle(view)}
      {...buildLoadingRootAttributes(view.loading)}
    >
      <div className="gdy-scope gdy-card">
        <KanbanToolbar state={state} view={view} />
        <KanbanFilterRow state={state} view={view} />
        <KanbanBoardBody state={state} view={view} />
      </div>
      <KanbanMoveAnnouncer moveMenu={state.moveMenu} />
    </div>
  );
};

export type {
  ArchivedViewConfig,
  ArchivedViewMode,
  ViewMode,
  ViewSwitchConfig,
  AiButtonConfig,
  ColumnDefinition,
  RowActions,
  KanbanBoardClassNames,
  KanbanColumnAttributes,
  KanbanColumnFooterContext,
  KanbanColumnHeaderContext,
  KanbanDropContext,
  KanbanBoardFeatures,
  KanbanBoardLabels,
  KanbanGroupOption,
  KanbanMoveEvent,
  KanbanMoveMenuMode,
  KanbanVisibleCardsState,
  KanbanCardClickEvent,
  KanbanBoardProps,
  DataInput,
} from "./types";

export type {
  RowAction,
  RowActionEntry,
  RowActionPlacement,
  RowActionSubmenu,
  RowActionVariant,
  BuiltInActionId,
  BuiltInMenuRef,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  SelectTheme,
  ToolbarCustomSlot,
  ToolbarLayout,
  ToolbarSide,
  ToggleDisplay,
  ToggleGroupConfig,
  ToggleOption,
  HeaderSelectConfig,
  SelectOption,
} from "../shared";
