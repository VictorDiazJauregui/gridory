import { useState, type KeyboardEvent, type RefObject } from "react";
import type { SidebarChat } from "./use-sidebar-chat";
import type { AIChatSidebarProps } from "../types";

type TextareaKeyboardEvent = KeyboardEvent<HTMLTextAreaElement>;

export type TextareaRef = RefObject<HTMLTextAreaElement | null>;

export interface MessageComposer {
  input: string;
  setInput: (value: string) => void;
  submit: (text?: string) => Promise<void>;
  handleKeyDown: (event: TextareaKeyboardEvent) => void;
  reset: () => void;
}

interface ComposerScope {
  chat: SidebarChat;
  props: AIChatSidebarProps;
  input: string;
  setInput: (value: string) => void;
  inputRef: TextareaRef;
}

const createComposerHandlers = (scope: ComposerScope) => {
  const submit = async (text?: string) => {
    const value = (text ?? scope.input).trim();
    if (!value || scope.chat.isLoading) return;
    scope.setInput("");
    await scope.chat.sendMessage(value);
  };
  const handleKeyDown = (event: TextareaKeyboardEvent) => {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    void submit();
  };
  const reset = () => {
    scope.chat.resetConversation();
    scope.props.onResetConversation?.();
    scope.inputRef.current?.focus();
  };
  return { submit, handleKeyDown, reset };
};

export const useMessageComposer = (
  chat: SidebarChat,
  props: AIChatSidebarProps,
  inputRef: TextareaRef,
): MessageComposer => {
  const [input, setInput] = useState("");
  return {
    input,
    setInput,
    ...createComposerHandlers({ chat, props, input, setInput, inputRef }),
  };
};
