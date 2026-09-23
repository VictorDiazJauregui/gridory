import { useCallback } from "react";
import { clearConversation } from "./chat/conversation-updates";
import { useConfirmAction } from "./chat/use-confirm-action";
import { useConversationState } from "./chat/use-conversation-state";
import { useRejectAction } from "./chat/use-reject-action";
import { useResolvedChatConfig } from "./chat/use-resolved-chat-config";
import { useSendMessage } from "./chat/use-send-message";
import type { UseAIChatConfig } from "./chat/chat-config";
import type { AIChatMessage, AIPendingAction } from "./types";

interface UseAIChatReturn {
  messages: AIChatMessage[];
  pendingActions: AIPendingAction[];
  isLoading: boolean;
  streamingContent: string;
  sendMessage: (text: string) => Promise<void>;
  confirmAction: (actionId: string) => void;
  rejectAction: (actionId: string) => void;
  resetConversation: () => void;
  clearMessages: () => void;
}

export const useAIChat = (config: UseAIChatConfig): UseAIChatReturn => {
  const conversation = useConversationState();
  const { controls, ...state } = conversation;
  const resolved = useResolvedChatConfig(config);
  const sendMessage = useSendMessage(config, resolved, conversation);
  const confirmAction = useConfirmAction(config, resolved, controls);
  const rejectAction = useRejectAction(resolved, controls);
  const resetConversation = useCallback(
    () => clearConversation(controls),
    [controls],
  );
  return {
    ...state,
    sendMessage,
    confirmAction,
    rejectAction,
    resetConversation,
    clearMessages: resetConversation,
  };
};
