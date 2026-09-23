import { useMemo } from "react";
import { resolveSystemPrompt } from "./prompt-builders";
import { useAIChat } from "./useAIChat";
import type { UseAIChatConfig } from "./chat-config";
import type { AIChatMode, AIChatSidebarProps } from "./types";

export type SidebarChat = ReturnType<typeof useAIChat> & { mode: AIChatMode };

const resolveMode = (props: AIChatSidebarProps): AIChatMode => {
  if (props.mode) return props.mode;
  return props.dataSchema ? "table" : "chatbot";
};

const resolveEnableActions = (props: AIChatSidebarProps, mode: AIChatMode) =>
  props.enableActions ?? (mode !== "chatbot" && Boolean(props.dataSchema));

const toChatConfig = (
  props: AIChatSidebarProps,
  mode: AIChatMode,
  systemPrompt: string,
): UseAIChatConfig => ({
  providerConfig: props.providerConfig,
  systemPrompt,
  mode,
  dataSchema: props.dataSchema,
  enableActions: resolveEnableActions(props, mode),
  memory: props.memory,
  texts: props.texts,
  onAction: props.onAction,
  onError: props.onError,
});

export const useSidebarChat = (props: AIChatSidebarProps): SidebarChat => {
  const { dataSchema, systemPrompt, chatbotPrompt } = props;
  const mode = resolveMode(props);
  const resolvedSystemPrompt = useMemo(
    () =>
      resolveSystemPrompt({ mode, dataSchema, systemPrompt, chatbotPrompt }),
    [mode, dataSchema, systemPrompt, chatbotPrompt],
  );
  const chat = useAIChat(toChatConfig(props, mode, resolvedSystemPrompt));
  return { mode, ...chat };
};
