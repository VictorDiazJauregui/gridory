import { AIChatMessageBubble } from "./AIChatMessageBubble";
import type { SidebarViewProps } from "../sidebar/use-sidebar-view";

export const AIChatTranscript = ({ view }: SidebarViewProps) =>
  view.chat.messages.map((message) => (
    <AIChatMessageBubble key={message.id} message={message} view={view} />
  ));
