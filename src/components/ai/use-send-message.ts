import { useCallback } from "react";
import {
  beginRequest,
  rejectMissingApiKey,
  runCompletion,
} from "./completion-flow";
import type { UseAIChatConfig } from "./chat-config";
import type { ConversationState } from "./use-conversation-state";
import type { ResolvedChatConfig } from "./use-resolved-chat-config";

export const useSendMessage = (
  config: UseAIChatConfig,
  resolved: ResolvedChatConfig,
  { controls, isLoading }: ConversationState,
) => {
  const { onError } = config;
  return useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;
      const scope = { resolved, controls, onError };
      if (!resolved.providerConfig.apiKey?.trim()) {
        rejectMissingApiKey(scope);
        return;
      }
      await runCompletion(scope, beginRequest(controls, trimmed));
    },
    [resolved, controls, isLoading, onError],
  );
};
