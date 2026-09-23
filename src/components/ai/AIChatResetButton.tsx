import { SquarePen } from "lucide-react";
import { Button } from "../ui/button";
import type { SidebarViewProps } from "./use-sidebar-view";

export const AIChatResetButton = ({ view }: SidebarViewProps) => {
  const { chat, composer, texts } = view;
  const canReset = chat.messages.length > 0 || chat.pendingActions.length > 0;
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="gdy-ai-reset"
      onClick={composer.reset}
      disabled={!canReset || chat.isLoading}
      title={texts.resetTooltip}
      aria-label={texts.resetTooltip}
    >
      <SquarePen className="gdy-ai-reset-icon" />
    </Button>
  );
};
