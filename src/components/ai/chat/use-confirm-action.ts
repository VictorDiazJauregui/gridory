import { useCallback } from "react";
import { toError } from "./chat-errors";
import {
  appendAssistantMessage,
  takePendingAction,
  type ConversationControls,
} from "./conversation-updates";
import { toActionEvent } from "../completion/pending-actions";
import type { UseAIChatConfig } from "./chat-config";
import type { ResolvedChatConfig } from "./use-resolved-chat-config";

interface ConfirmScope {
  controls: ConversationControls;
  onError?: (error: Error) => void;
}

const publishConfirmError = (
  { controls, onError }: ConfirmScope,
  unknownError: unknown,
) => {
  const error = toError(unknownError, "No se pudo confirmar la acción.");
  onError?.(error);
  appendAssistantMessage(
    controls,
    `No pude confirmar la acción: ${error.message}`,
  );
};

export const useConfirmAction = (
  config: UseAIChatConfig,
  resolved: ResolvedChatConfig,
  controls: ConversationControls,
) => {
  const { onAction, onError } = config;
  return useCallback(
    (actionId: string) => {
      const action = takePendingAction(controls, actionId);
      if (!action) return;
      try {
        onAction?.(toActionEvent(action));
        appendAssistantMessage(controls, resolved.texts.actionConfirmed);
      } catch (unknownError) {
        publishConfirmError({ controls, onError }, unknownError);
      }
    },
    [onAction, onError, resolved.texts, controls],
  );
};
