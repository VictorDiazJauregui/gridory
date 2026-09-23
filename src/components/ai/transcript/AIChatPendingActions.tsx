import { ActionConfirmCard } from "../actions/ActionConfirmCard";
import type { SidebarViewProps } from "../sidebar/use-sidebar-view";

export const AIChatPendingActions = ({ view }: SidebarViewProps) => {
  const { chat, dataSchema, texts } = view;
  if (chat.mode === "chatbot") return null;
  return chat.pendingActions.map((action) => (
    <ActionConfirmCard
      key={action.id}
      action={action}
      schema={dataSchema}
      texts={texts}
      onConfirm={chat.confirmAction}
      onCancel={chat.rejectAction}
    />
  ));
};
