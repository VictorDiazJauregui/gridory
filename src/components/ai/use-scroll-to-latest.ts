import { useEffect, useRef } from "react";
import type { SidebarChat } from "./use-sidebar-chat";

export const useScrollToLatest = (chat: SidebarChat) => {
  const { messages, streamingContent, pendingActions } = chat;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent, pendingActions]);
  return messagesEndRef;
};
