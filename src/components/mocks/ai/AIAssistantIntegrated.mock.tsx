import { useState } from "react";
import { AiDemoChat } from "./AiDemoChat";
import { AiDemoHeader } from "./AiDemoHeader";
import { AiDemoWorkspace } from "./workspace/AiDemoWorkspace";
import { useMockAiRows } from "./use-mock-ai-rows";
import type { DemoView } from "./ai-config";

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
