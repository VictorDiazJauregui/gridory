import { cn } from "../../lib/cn";
import { AIChatBody } from "./transcript/AIChatBody";
import { AIChatFooter } from "./sidebar/AIChatFooter";
import { AIChatHeader } from "./sidebar/AIChatHeader";
import { AIChatOverlay } from "./sidebar/AIChatOverlay";
import { useSidebarView } from "./sidebar/use-sidebar-view";
import type { AIChatSidebarProps } from "./types";
import "./styles.css";

export const AIChatSidebar = (props: AIChatSidebarProps) => {
  const { className, classNames, width = 380 } = props;
  const { view, inputRef, messagesEndRef } = useSidebarView(props);
  return (
    <>
      <AIChatOverlay view={view} />
      <aside
        className={cn("gdy-scope gdy-ai-sidebar", className, classNames?.root)}
        data-state={view.open ? "open" : "closed"}
        style={{ width }}
      >
        <AIChatHeader view={view} />
        <AIChatBody view={view} messagesEndRef={messagesEndRef} />
        <AIChatFooter view={view} inputRef={inputRef} />
      </aside>
    </>
  );
};
