import type {
  AIActionEvent,
  AIChatMode,
  AIDataSchema,
  AIMemoryConfig,
  AIProviderConfig,
  AITextOverrides,
} from "./types";

export interface UseAIChatConfig {
  providerConfig: AIProviderConfig;
  systemPrompt: string;
  mode: AIChatMode;
  dataSchema?: AIDataSchema;
  enableActions?: boolean;
  memory?: AIMemoryConfig;
  texts?: AITextOverrides;
  onAction?: (event: AIActionEvent) => void;
  onError?: (error: Error) => void;
}
