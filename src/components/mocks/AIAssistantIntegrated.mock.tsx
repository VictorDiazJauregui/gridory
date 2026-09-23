import { useState } from "react";
import { AiDemoChat } from "./ai-demo/AiDemoChat";
import { AiDemoHeader } from "./ai-demo/AiDemoHeader";
import { AiDemoWorkspace } from "./ai-demo/AiDemoWorkspace";
import { useMockAiRows } from "./ai-demo/use-mock-ai-rows";
import type { DemoView } from "./data/mockAiConfig";

export const AIAssistantIntegratedMock = () => {
  const [view, setView] = useState<DemoView>("table");
  const [aiOpen, setAiOpen] = useState(false);
  const aiRows = useMockAiRows();
  const openAi = () => setAiOpen(true);
  const closeAi = () => setAiOpen(false);
  return (
    <div className="space-y-4">
      <AiDemoHeader view={view} onViewChange={setView} onOpenAi={openAi} />
      <AiDemoWorkspace view={view} aiRows={aiRows} />
      <AiDemoChat open={aiOpen} onClose={closeAi} view={view} aiRows={aiRows} />
    </div>
  );
};
