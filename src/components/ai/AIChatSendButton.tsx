import { Send } from "lucide-react";
import { Button } from "../ui/button";
import type { SidebarViewProps } from "./use-sidebar-view";

export const AIChatSendButton = ({ view }: SidebarViewProps) => {
  const { composer, chat } = view;
  return (
    <Button
      size="icon"
      className="gdy-ai-send"
      onClick={() => void composer.submit()}
      disabled={!composer.input.trim() || chat.isLoading}
      aria-label="Enviar"
    >
      <Send className="gdy-ai-send-icon" />
    </Button>
  );
};
