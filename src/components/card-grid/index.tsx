import "./styles.css";
import { cn } from "../../lib/cn";
import { KanbanFilterRow } from "../kanban/toolbar/KanbanFilterRow";
import { buildLoadingRootAttributes } from "../shared/loading/loading-state";
import { resolveRootStyle } from "../shared/root-style";
import { Toolbar } from "../shared/toolbar/Toolbar";
import { TablePagination } from "../table/pagination/TablePagination";
import { CardGridBody } from "./grid/CardGridBody";
import { buildCardGridPaginationProps } from "./grid/pagination-props";
import { buildCardGridToolbarProps } from "./grid/toolbar-props";
import { useCardGridModel } from "./model/use-card-grid-model";
import type { CardGridSettings } from "./settings";
import type { CardGridProps } from "./types";

const resolveRootClassName = <TData,>(settings: CardGridSettings<TData>) =>
  cn("gdy-card-grid", settings.thinScrollbars && "gdy-thin-scroll", settings.className, settings.classNames?.root);

export const CardGrid = <TData,>(props: CardGridProps<TData>) => {
  const model = useCardGridModel(props);
  const { settings } = model;
  return (
    <div
      className={resolveRootClassName(settings)}
      style={resolveRootStyle(settings)}
      {...buildLoadingRootAttributes(settings.loading)}
    >
      <div className="gdy-scope gdy-card">
        <Toolbar {...buildCardGridToolbarProps(model)} />
        <KanbanFilterRow state={model.controls} view={model.fieldSettings} />
        <CardGridBody model={model} />
        <TablePagination {...buildCardGridPaginationProps(model)} />
      </div>
    </div>
  );
};

export type {
  AiButtonConfig,
  ArchivedViewConfig,
  ArchivedViewMode,
  CardClickEvent,
  CardGridClassNames,
  CardGridFeatures,
  CardGridLabels,
  CardGridProps,
  ColumnDefinition,
  ColumnFiltersState,
  ColumnSortingState,
  DataInput,
  ManualPaginationState,
  RowActions,
  VisibleRowsState,
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
