import { cn } from "../../lib/cn";
import { AIChatSendButton } from "./AIChatSendButton";
import { AIChatTextarea } from "./AIChatTextarea";
import type { SidebarElements } from "./use-sidebar-view";

type AIChatFooterProps = Pick<SidebarElements, "view" | "inputRef">;

export const AIChatFooter = ({ view, inputRef }: AIChatFooterProps) => (
  <footer className={cn("gdy-ai-footer", view.classNames?.footer)}>
    <div className={cn("gdy-ai-input-wrapper", view.classNames?.inputWrapper)}>
      <AIChatTextarea view={view} inputRef={inputRef} />
      <AIChatSendButton view={view} />
    </div>
  </footer>
);
