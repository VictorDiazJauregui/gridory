import type { StreamChatCompletionResult } from "./ai-client";
import { normalizeAIError, toError } from "./chat-errors";
import { requestCompletion } from "./completion-request";
import {
  appendAssistantMessage,
  createChatMessage,
  type ConversationControls,
} from "./conversation-updates";
import { resolveFallbackActions } from "./fallback-action";
import { mapToolCallToAction } from "./pending-actions";
import type { ResolvedChatConfig } from "./use-resolved-chat-config";
import type { ResolvedTexts } from "./use-resolved-texts";
import type { AIChatMessage, AIPendingAction } from "./types";

export interface CompletionScope {
  resolved: ResolvedChatConfig;
  controls: ConversationControls;
  onError?: (error: Error) => void;
}

export const rejectMissingApiKey = ({
  resolved,
  controls,
  onError,
}: CompletionScope) => {
  const error = new Error(resolved.texts.missingApiKey);
  onError?.(error);
  appendAssistantMessage(controls, error.message);
};

export const beginRequest = (
  controls: ConversationControls,
  trimmed: string,
): AIChatMessage => {
  const userMessage = createChatMessage("user", trimmed);
  controls.setMessages((previous) => [...previous, userMessage]);
  controls.setIsLoading(true);
  controls.setStreamingContent("");
  return userMessage;
};

const mapToolCallActions = (
  resolved: ResolvedChatConfig,
  result: StreamChatCompletionResult,
): AIPendingAction[] => {
  if (!resolved.enableActions) return [];
  return result.toolCalls
    .map((toolCall) =>
      mapToolCallToAction({
        toolCall,
        rawResponse: result.rawResponse || result.content,
        mode: resolved.mode,
        schema: resolved.dataSchema,
      }),
    )
    .filter((action): action is AIPendingAction => Boolean(action));
};

const resolvePendingActions = (
  resolved: ResolvedChatConfig,
  result: StreamChatCompletionResult,
  mappedActions: AIPendingAction[],
): AIPendingAction[] => {
  if (mappedActions.length > 0) return mappedActions;
  return resolveFallbackActions(result.content, {
    enableActions: resolved.enableActions,
    mode: resolved.mode,
    schema: resolved.dataSchema,
  });
};

const resolveAssistantText = (
  texts: ResolvedTexts,
  result: StreamChatCompletionResult,
  mappedActionCount: number,
): string =>
  result.content.trim() ||
  (mappedActionCount > 0 ? texts.actionProposed : texts.noResponse);

const publishAssistantReply = (
  resolved: ResolvedChatConfig,
  controls: ConversationControls,
  result: StreamChatCompletionResult,
) => {
  controls.setStreamingContent("");
  const mappedActions = mapToolCallActions(resolved, result);
  const newActions = resolvePendingActions(resolved, result, mappedActions);
  if (newActions.length > 0) {
    controls.setPendingActions((previous) => [...previous, ...newActions]);
  }
  appendAssistantMessage(
    controls,
    resolveAssistantText(resolved.texts, result, mappedActions.length),
  );
};

const publishRequestError = (
  { resolved, controls, onError }: CompletionScope,
  unknownError: unknown,
) => {
  const error = normalizeAIError(
    toError(unknownError, resolved.texts.genericError),
    resolved.providerConfig.baseURL,
  );
  onError?.(error);
  appendAssistantMessage(controls, `Ocurrió un error: ${error.message}`);
};

export const runCompletion = async (
  scope: CompletionScope,
  userMessage: AIChatMessage,
) => {
  const { resolved, controls } = scope;
  try {
    const history = [...controls.messagesRef.current, userMessage];
    const result = await requestCompletion(
      resolved,
      history,
      controls.setStreamingContent,
    );
    publishAssistantReply(resolved, controls, result);
  } catch (unknownError) {
    publishRequestError(scope, unknownError);
  } finally {
    controls.setIsLoading(false);
    controls.setStreamingContent("");
  }
};
