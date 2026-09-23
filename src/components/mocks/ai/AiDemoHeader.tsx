import { AIChatButton } from "../../ai";
import type { DemoView } from "./ai-config";
import { AiDemoHint } from "./AiDemoHint";
import { ApiKeyBanner } from "./ApiKeyBanner";
import { DemoViewToggle } from "./DemoViewToggle";

interface AiDemoHeaderProps {
  view: DemoView;
  onViewChange: (view: DemoView) => void;
  onOpenAi: () => void;
}

export const AiDemoHeader = ({
  view,
  onViewChange,
  onOpenAi,
}: AiDemoHeaderProps) => (
  <div className="rounded-lg border bg-card p-4">
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="text-lg font-semibold">
        Mock AI Assistant (Tabla + Kanban)
      </h2>
      <div className="ml-auto flex items-center gap-2">
        <DemoViewToggle view={view} onChange={onViewChange} />
        <AIChatButton onClick={onOpenAi} label="Asistente AI" />
      </div>
    </div>
    <AiDemoHint />
    <ApiKeyBanner />
  </div>
);
