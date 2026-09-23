import { Loader2 } from "lucide-react";
import { AIChatAvatar } from "./AIChatAvatar";
import type { SidebarViewProps } from "../sidebar/use-sidebar-view";

export const AIChatThinkingIndicator = ({ view }: SidebarViewProps) => {
  const { isLoading, streamingContent } = view.chat;
  if (!isLoading || streamingContent) return null;
  return (
    <div className="gdy-ai-message" data-role="assistant" data-thinking="">
      <AIChatAvatar />
      <div className="gdy-ai-thinking">
        <div className="gdy-ai-thinking-content">
          <Loader2 className="gdy-ai-thinking-icon" />
          <span className="gdy-ai-thinking-label">{view.texts.thinking}</span>
        </div>
      </div>
    </div>
  );
};
