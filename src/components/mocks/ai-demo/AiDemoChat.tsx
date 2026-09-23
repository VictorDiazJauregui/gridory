import { AIChatSidebar } from "../../ai";
import { AI_PROVIDER_CONFIG, type DemoView } from "../data/mockAiConfig";
import { useAiChatContext } from "./use-ai-chat-context";
import type { MockAiRows } from "./use-mock-ai-rows";

interface AiDemoChatProps {
  open: boolean;
  onClose: () => void;
  view: DemoView;
  aiRows: MockAiRows;
}

export const AiDemoChat = (props: AiDemoChatProps) => {
  const { open, onClose, view, aiRows } = props;
  const { rows, handleAIAction } = aiRows;
  const { dataSchema, systemPrompt } = useAiChatContext(rows, view);
  return (
    <AIChatSidebar
      open={open}
      onClose={onClose}
      providerConfig={AI_PROVIDER_CONFIG}
      title="Asistente AI - Demo"
      subtitle={`${rows.length} empresas · ${view === "table" ? "Vista tabla" : "Vista kanban"}`}
      mode={view}
      dataSchema={dataSchema}
      systemPrompt={systemPrompt}
      enableActions
      onAction={handleAIAction}
    />
  );
};
