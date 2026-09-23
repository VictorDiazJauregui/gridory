import type { RefObject } from "react";
import {
  DEFAULT_EMPTY_STATE_CHATBOT,
  DEFAULT_EMPTY_STATE_DATA,
  DEFAULT_SUGGESTED_MESSAGES_CHATBOT,
  DEFAULT_SUGGESTED_MESSAGES_DATA,
} from "../constants";
import { useFocusOnOpen } from "./use-focus-on-open";
import {
  useMessageComposer,
  type MessageComposer,
  type TextareaRef,
} from "./use-message-composer";
import { useResolvedTexts, type ResolvedTexts } from "../chat/use-resolved-texts";
import { useScrollToLatest } from "./use-scroll-to-latest";
import { useSidebarChat, type SidebarChat } from "./use-sidebar-chat";
import type {
  AIChatClassNames,
  AIChatMode,
  AIChatSidebarProps,
  AIDataSchema,
  AIEmptyState,
  AISuggestedMessage,
} from "../types";

interface ResolvedEmptyState {
  title: string;
  description: string;
  icon?: AIEmptyState["icon"];
}

interface SidebarOptions {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle: string;
  empty: ResolvedEmptyState;
  chips: AISuggestedMessage[];
  showResetButton: boolean;
  classNames?: AIChatClassNames;
  dataSchema?: AIDataSchema;
}

export interface SidebarView extends SidebarOptions {
  chat: SidebarChat;
  composer: MessageComposer;
  texts: ResolvedTexts;
}

export interface SidebarViewProps {
  view: SidebarView;
}

/**
 * Refs travel beside the view, not inside it: the compiler-backed
 * `react-hooks/refs` rule treats any object holding a ref as a ref itself and
 * rejects every read of it during render.
 */
export interface SidebarElements extends SidebarViewProps {
  inputRef: TextareaRef;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

const resolveEmptyState = (
  mode: AIChatMode,
  explicit: AIEmptyState | undefined,
  textOverrides: AIChatSidebarProps["texts"],
): ResolvedEmptyState => {
  const fallback =
    mode === "chatbot" ? DEFAULT_EMPTY_STATE_CHATBOT : DEFAULT_EMPTY_STATE_DATA;
  const textBase =
    mode === "chatbot" ? textOverrides?.emptyChatbot : textOverrides?.emptyData;
  return {
    title: explicit?.title ?? textBase?.title ?? fallback.title,
    description:
      explicit?.description ?? textBase?.description ?? fallback.description,
    icon: explicit?.icon ?? textBase?.icon,
  };
};

const resolveSubtitle = (
  mode: AIChatMode,
  dataSchema: AIChatSidebarProps["dataSchema"],
): string => {
  if (dataSchema) {
    return `${dataSchema.rows?.length ?? 0} registros · ${dataSchema.entityName}`;
  }
  return mode === "chatbot" ? "Chat asistido" : "Asistente contextual";
};

const defaultChips = (mode: AIChatMode): AISuggestedMessage[] =>
  mode === "chatbot"
    ? DEFAULT_SUGGESTED_MESSAGES_CHATBOT
    : DEFAULT_SUGGESTED_MESSAGES_DATA;

const resolveSidebarOptions = (
  props: AIChatSidebarProps,
  mode: AIChatMode,
): SidebarOptions => {
  const { title = "Asistente AI", showResetButton = true } = props;
  return {
    open: props.open,
    onClose: props.onClose,
    title,
    subtitle: props.subtitle ?? resolveSubtitle(mode, props.dataSchema),
    empty: resolveEmptyState(mode, props.emptyState, props.texts),
    chips: props.suggestedMessages ?? defaultChips(mode),
    showResetButton,
    classNames: props.classNames,
    dataSchema: props.dataSchema,
  };
};

export const useSidebarView = (props: AIChatSidebarProps): SidebarElements => {
  const chat = useSidebarChat(props);
  const inputRef = useFocusOnOpen(props.open);
  const composer = useMessageComposer(chat, props, inputRef);
  const messagesEndRef = useScrollToLatest(chat);
  const texts = useResolvedTexts(props.texts);
  const view = {
    chat,
    composer,
    texts,
    ...resolveSidebarOptions(props, chat.mode),
  };
  return { view, inputRef, messagesEndRef };
};
