import { Bot } from "lucide-react";
import { AIChatSuggestionChips } from "./AIChatSuggestionChips";
import type { SidebarViewProps } from "./use-sidebar-view";

export const AIChatEmptyState = ({ view }: SidebarViewProps) => {
  const { empty } = view;
  return (
    <div className="gdy-ai-empty">
      <div className="gdy-ai-empty-badge">
        {empty.icon ?? <Bot className="gdy-ai-empty-icon" />}
      </div>
      <div className="gdy-ai-empty-text">
        <p className="gdy-ai-empty-title">{empty.title}</p>
        <p className="gdy-ai-empty-description">{empty.description}</p>
      </div>
      <AIChatSuggestionChips view={view} />
    </div>
  );
};
