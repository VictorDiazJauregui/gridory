import { cn } from "../../../lib/cn";
import { AIChatEmptyState } from "./AIChatEmptyState";
import { AIChatPendingActions } from "./AIChatPendingActions";
import { AIChatStreamingMessage } from "./AIChatStreamingMessage";
import { AIChatThinkingIndicator } from "./AIChatThinkingIndicator";
import { AIChatTranscript } from "./AIChatTranscript";
import type { SidebarElements } from "../sidebar/use-sidebar-view";

type AIChatBodyProps = Pick<SidebarElements, "view" | "messagesEndRef">;

export const AIChatBody = ({ view, messagesEndRef }: AIChatBodyProps) => {
  const isEmpty = view.chat.messages.length === 0;
  return (
    <div
      className={cn("gdy-ai-body", view.classNames?.body)}
      data-empty={isEmpty || undefined}
    >
      {isEmpty ? <AIChatEmptyState view={view} /> : null}
      <AIChatTranscript view={view} />
      <AIChatStreamingMessage view={view} />
      <AIChatThinkingIndicator view={view} />
      <AIChatPendingActions view={view} />
      <div ref={messagesEndRef} className="gdy-ai-end" />
    </div>
  );
};
