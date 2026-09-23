import { cn } from "../../lib/cn";
import { AIChatAvatar } from "./AIChatAvatar";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { SidebarViewProps } from "./use-sidebar-view";
import type { AIChatMessage } from "./types";

interface MessageBubbleProps extends SidebarViewProps {
  message: AIChatMessage;
}

export const AIChatMessageBubble = ({ message, view }: MessageBubbleProps) => {
  const { classNames } = view;
  const slot =
    message.role === "user"
      ? classNames?.userBubble
      : classNames?.assistantBubble;
  return (
    <div className="gdy-ai-message" data-role={message.role}>
      {message.role === "assistant" ? <AIChatAvatar /> : null}
      <div className={cn("gdy-ai-bubble", slot)} data-role={message.role}>
        {message.role === "assistant" ? (
          <MarkdownRenderer text={message.content} />
        ) : (
          <p className="gdy-ai-text">{message.content}</p>
        )}
      </div>
    </div>
  );
};
