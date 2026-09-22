import type { ReactNode } from "react";

export type AIChatMode = "chatbot" | "table" | "kanban";

export type AIHistoryStrategy = "sliding-window" | "minimal" | "none";

export interface AIProviderConfig {
  apiKey: string;
  baseURL: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIMemoryConfig {
  enabled: boolean;
  strategy?: AIHistoryStrategy;
  maxMessages?: number;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface AISuggestedMessage {
  label: string;
  prompt: string;
}

export interface AIEmptyState {
  title?: string;
  description?: string;
  icon?: ReactNode;
}

export type AIFieldType = "text" | "number" | "date" | "select" | "boolean";

export interface AIFieldOption {
  value: string;
  label: string;
}

export interface AIFieldDescriptor {
  id: string;
  label: string;
  type: AIFieldType;
  description?: string;
  options?: AIFieldOption[];
  required?: boolean;
  fixedValue?: unknown;
  defaultValue?: unknown;
}

export interface AIDataSchema {
  entityName: string;
  entityNameSingular: string;
  fields: AIFieldDescriptor[];
  rows?: Record<string, unknown>[];
  kanbanGroupField?: string;
  summary?: string;
  extraInstructions?: string;
}

export type AIActionType =
  | "create-row"
  | "create-card"
  | "update-row"
  | "move-card"
  | "custom";

export interface AIActionEvent {
  type: AIActionType;
  mode: AIChatMode;
  payload: Record<string, unknown>;
  rawResponse: string;
}

export interface AIPendingAction extends AIActionEvent {
  id: string;
  title?: string;
}

export interface AITextOverrides {
  placeholder?: string;
  thinking?: string;
  confirmRequired?: string;
  confirmCta?: string;
  cancelCta?: string;
  actionConfirmed?: string;
  actionCancelled?: string;
  resetTooltip?: string;
  missingApiKey?: string;
  genericError?: string;
  noResponse?: string;
  actionProposed?: string;
  emptyChatbot?: AIEmptyState;
  emptyData?: AIEmptyState;
}

export interface AIChatClassNames {
  root?: string;
  header?: string;
  body?: string;
  footer?: string;
  userBubble?: string;
  assistantBubble?: string;
  chip?: string;
  inputWrapper?: string;
  textarea?: string;
}

export interface AIChatSidebarProps {
  open: boolean;
  onClose: () => void;
  providerConfig: AIProviderConfig;

  mode?: AIChatMode;
  dataSchema?: AIDataSchema;

  systemPrompt?: string;
  chatbotPrompt?: string;
  suggestedMessages?: AISuggestedMessage[];

  title?: string;
  subtitle?: string;
  emptyState?: AIEmptyState;
  texts?: AITextOverrides;

  enableActions?: boolean;
  onAction?: (event: AIActionEvent) => void;
  onError?: (error: Error) => void;
  onResetConversation?: () => void;

  memory?: AIMemoryConfig;

  showResetButton?: boolean;
  className?: string;
  classNames?: AIChatClassNames;
  width?: number | string;
}
