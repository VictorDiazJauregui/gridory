import "./styles.css";
import { cn } from "../../lib/cn";
import { resolveRootStyle } from "../shared/root-style";
import { applyBoardDefaults, assertGroupConfiguration } from "./board-view";
import { KanbanBoardBody } from "./board/KanbanBoardBody";
import { KanbanFilterRow } from "./toolbar/KanbanFilterRow";
import { KanbanToolbar } from "./toolbar/KanbanToolbar";
import type { KanbanBoardProps } from "./types";
import { useKanbanBoardState } from "./model/use-kanban-board-state";

export const KanbanBoard = <TData,>(props: KanbanBoardProps<TData>) => {
  assertGroupConfiguration(props.groups, props.defaultGroupId);
  const view = applyBoardDefaults(props);
  const state = useKanbanBoardState(view);
  return (
    <div
      className={cn("gdy-kanban", view.thinScrollbars && "gdy-thin-scroll")}
      style={resolveRootStyle(view)}
    >
      <div className="gdy-scope gdy-card">
        <KanbanToolbar state={state} view={view} />
        <KanbanFilterRow state={state} view={view} />
        <KanbanBoardBody state={state} view={view} />
      </div>
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
  KanbanBoardFeatures,
  KanbanGroupOption,
  KanbanMoveEvent,
  KanbanCardClickEvent,
  KanbanBoardProps,
  DataInput,
} from "./types";

export type {
  RowAction,
  RowActionPlacement,
  RowActionVariant,
  BuiltInActionId,
  BuiltInMenuRef,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  SelectTheme,
  ToolbarLayout,
  ToolbarSide,
  ToggleDisplay,
  ToggleGroupConfig,
  ToggleOption,
  HeaderSelectConfig,
  SelectOption,
} from "../shared";
