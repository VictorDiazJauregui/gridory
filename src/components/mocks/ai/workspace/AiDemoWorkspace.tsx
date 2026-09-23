import type { DemoView } from "../ai-config";
import { AiDemoKanban } from "./AiDemoKanban";
import { AiDemoSteps } from "./AiDemoSteps";
import { AiDemoTable } from "./AiDemoTable";
import { AiEventLog } from "./AiEventLog";
import type { MockAiRows } from "../use-mock-ai-rows";

interface AiDemoWorkspaceProps {
  view: DemoView;
  aiRows: MockAiRows;
}

export const AiDemoWorkspace = ({ view, aiRows }: AiDemoWorkspaceProps) => (
  <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
    <div className="rounded-lg border bg-card p-3">
      {view === "table" ? (
        <AiDemoTable rows={aiRows.rows} setRows={aiRows.setRows} />
      ) : (
        <AiDemoKanban rows={aiRows.rows} setRows={aiRows.setRows} />
      )}
    </div>
    <aside className="space-y-3">
      <AiDemoSteps />
      <AiEventLog events={aiRows.eventLog} />
    </aside>
  </div>
);
