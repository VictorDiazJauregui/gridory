import { useMemo, useState } from "react";
import { useLatestRef } from "./use-latest-ref";
import type { ConversationControls } from "./conversation-updates";
import type { AIChatMessage, AIPendingAction } from "../types";

export interface ConversationState {
  messages: AIChatMessage[];
  pendingActions: AIPendingAction[];
  isLoading: boolean;
  streamingContent: string;
  controls: ConversationControls;
}

export const useConversationState = (): ConversationState => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [pendingActions, setPendingActions] = useState<AIPendingAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesRef = useLatestRef(messages);
  const pendingActionsRef = useLatestRef(pendingActions);
  const controls = useMemo<ConversationControls>(
    () => ({
      messagesRef,
      pendingActionsRef,
      setMessages,
      setPendingActions,
      setIsLoading,
      setStreamingContent,
    }),
    [messagesRef, pendingActionsRef],
  );
  return { messages, pendingActions, isLoading, streamingContent, controls };
};
