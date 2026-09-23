// Data table
export { DataTable } from "./table";
export type {
  ColumnSortingState,
  DataTableFeatures,
  DataTableProps,
  GroupHeader,
  ManualPaginationState,
  RowGroupingResult,
} from "./table";

// Kanban board
export { KanbanBoard } from "./kanban";
export type {
  KanbanBoardFeatures,
  KanbanBoardProps,
  KanbanCardClickEvent,
  KanbanCardRenderContext,
  KanbanDateFiltersState,
  KanbanFiltersState,
  KanbanGroupOption,
  KanbanMoveEvent,
  KanbanSortingState,
} from "./kanban";

// Data model and toolbar contracts shared by table and kanban
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
} from "./components/shared/data-model";
export {
  BUILT_IN_ROW_ACTION_IDS,
  DuplicateRowActionError,
} from "./components/shared";
export type {
  BuiltInActionId,
  BuiltInMenuRef,
  HeaderSelectConfig,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  RowAction,
  RowActionPlacement,
  RowActionVariant,
  SelectOption,
  SelectTheme,
  ToggleDisplay,
  ToggleGroupConfig,
  ToggleOption,
  ToolbarLayout,
  ToolbarSide,
} from "./components/shared";

// AI assistant
export { AIChatSidebar, AIChatButton, useAIChat } from "./ai";
export {
  AI_PROVIDER_PRESETS,
  buildChatbotSystemPrompt,
  buildKanbanSystemPrompt,
  buildTableSystemPrompt,
  buildToolDefinitions,
  DEFAULT_EMPTY_STATE_CHATBOT,
  DEFAULT_EMPTY_STATE_DATA,
  DEFAULT_MEMORY_CONFIG,
  DEFAULT_PROVIDER_CONFIG,
  DEFAULT_SUGGESTED_MESSAGES_CHATBOT,
  DEFAULT_SUGGESTED_MESSAGES_DATA,
  DEFAULT_TEXTS,
  resolveProviderConfig,
  resolveSystemPrompt,
} from "./ai";
export type {
  AIActionEvent,
  AIActionType,
  AIChatClassNames,
  AIChatMessage,
  AIChatMode,
  AIChatSidebarProps,
  AIDataSchema,
  AIEmptyState,
  AIFieldDescriptor,
  AIFieldOption,
  AIFieldType,
  AIHistoryStrategy,
  AIMemoryConfig,
  AIPendingAction,
  AIProviderConfig,
  AIProviderPreset,
  AISuggestedMessage,
  AITextOverrides,
} from "./ai";
