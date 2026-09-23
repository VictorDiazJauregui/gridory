import { cn } from "../../lib/cn";
import type { SidebarElements } from "./use-sidebar-view";

type AIChatTextareaProps = Pick<SidebarElements, "view" | "inputRef">;

export const AIChatTextarea = ({ view, inputRef }: AIChatTextareaProps) => {
  const { composer, texts, classNames, chat } = view;
  return (
    <textarea
      ref={inputRef}
      rows={3}
      value={composer.input}
      onChange={(event) => composer.setInput(event.target.value)}
      onKeyDown={composer.handleKeyDown}
      placeholder={texts.placeholder}
      className={cn("gdy-ai-textarea", classNames?.textarea)}
      disabled={chat.isLoading}
    />
  );
};
