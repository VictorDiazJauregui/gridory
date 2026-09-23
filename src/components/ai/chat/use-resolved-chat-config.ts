import { useMemo } from "react";
import type OpenAI from "openai";
import { createAIClient } from "../completion/ai-client";
import { DEFAULT_MEMORY_CONFIG } from "../constants";
import { useResolvedTexts, type ResolvedTexts } from "./use-resolved-texts";
import type { UseAIChatConfig } from "./chat-config";
import type { AIMemoryConfig } from "../types";

type RequestContext = Pick<
  UseAIChatConfig,
  "providerConfig" | "systemPrompt" | "mode" | "dataSchema"
>;

export interface ResolvedChatConfig extends RequestContext {
  client: OpenAI;
  enableActions: boolean;
  memory: Required<AIMemoryConfig>;
  texts: ResolvedTexts;
}

const resolveMemoryConfig = (
  memory: AIMemoryConfig | undefined,
): Required<AIMemoryConfig> => {
  if (!memory) return DEFAULT_MEMORY_CONFIG;
  return {
    enabled: memory.enabled,
    strategy: memory.strategy ?? DEFAULT_MEMORY_CONFIG.strategy,
    maxMessages: memory.maxMessages ?? DEFAULT_MEMORY_CONFIG.maxMessages,
  };
};

const useRequestContext = (config: UseAIChatConfig): RequestContext => {
  const { providerConfig, systemPrompt, mode, dataSchema } = config;
  return useMemo(
    () => ({ providerConfig, systemPrompt, mode, dataSchema }),
    [providerConfig, systemPrompt, mode, dataSchema],
  );
};

export const useResolvedChatConfig = (
  config: UseAIChatConfig,
): ResolvedChatConfig => {
  const enableActions = config.enableActions ?? config.mode !== "chatbot";
  const client = useMemo(
    () => createAIClient(config.providerConfig),
    [config.providerConfig],
  );
  const memory = useMemo(
    () => resolveMemoryConfig(config.memory),
    [config.memory],
  );
  const texts = useResolvedTexts(config.texts);
  const request = useRequestContext(config);
  return useMemo(
    () => ({ ...request, client, enableActions, memory, texts }),
    [request, client, enableActions, memory, texts],
  );
};
