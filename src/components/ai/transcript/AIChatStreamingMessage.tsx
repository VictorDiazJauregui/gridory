import { cn } from "../../../lib/cn";
import { AIChatAvatar } from "./AIChatAvatar";
import { MarkdownRenderer } from "./MarkdownRenderer";
import type { SidebarViewProps } from "../sidebar/use-sidebar-view";

export const AIChatStreamingMessage = ({ view }: SidebarViewProps) => {
  const { streamingContent } = view.chat;
  if (!streamingContent) return null;
  return (
    <div className="gdy-ai-message" data-role="assistant" data-streaming="">
      <AIChatAvatar />
      <div
        className={cn("gdy-ai-bubble", view.classNames?.assistantBubble)}
        data-role="assistant"
      >
        <MarkdownRenderer text={`${streamingContent}▌`} />
      </div>
    </div>
  );
};
