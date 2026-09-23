import { useCallback } from "react";
import {
  appendAssistantMessage,
  removePendingAction,
  type ConversationControls,
} from "./conversation-updates";
import type { ResolvedChatConfig } from "./use-resolved-chat-config";

export const useRejectAction = (
  resolved: ResolvedChatConfig,
  controls: ConversationControls,
) =>
  useCallback(
    (actionId: string) => {
      removePendingAction(controls, actionId);
      appendAssistantMessage(controls, resolved.texts.actionCancelled);
    },
    [resolved.texts, controls],
  );
