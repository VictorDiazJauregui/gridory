import type { Dispatch, RefObject, SetStateAction } from "react";
import { createId } from "./create-id";
import type { AIChatMessage, AIPendingAction } from "../types";

export interface ConversationControls {
  messagesRef: RefObject<AIChatMessage[]>;
  pendingActionsRef: RefObject<AIPendingAction[]>;
  setMessages: Dispatch<SetStateAction<AIChatMessage[]>>;
  setPendingActions: Dispatch<SetStateAction<AIPendingAction[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setStreamingContent: Dispatch<SetStateAction<string>>;
}

export const createChatMessage = (
  role: AIChatMessage["role"],
  content: string,
): AIChatMessage => ({ id: createId(), role, content, timestamp: Date.now() });

export const appendAssistantMessage = (
  controls: ConversationControls,
  content: string,
) => {
  controls.setMessages((previous) => [
    ...previous,
    createChatMessage("assistant", content),
  ]);
};

export const removePendingAction = (
  controls: ConversationControls,
  actionId: string,
) => {
  controls.setPendingActions((previous) =>
    previous.filter((action) => action.id !== actionId),
  );
};

export const takePendingAction = (
  controls: ConversationControls,
  actionId: string,
): AIPendingAction | undefined => {
  const action = controls.pendingActionsRef.current.find(
    (candidate) => candidate.id === actionId,
  );
  if (!action) return undefined;
  removePendingAction(controls, actionId);
  return action;
};

export const clearConversation = (controls: ConversationControls) => {
  controls.setMessages([]);
  controls.setPendingActions([]);
  controls.setStreamingContent("");
};
