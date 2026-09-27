import type { ReactNode } from "react";
import { DemoEventLog } from "../shared/DemoEventLog";
import { useDemoEventLog } from "../shared/use-demo-event-log";
import type { RecordDemoEvent } from "../shared/use-demo-event-log";
import { SidebarDemoSection } from "./SidebarDemoSection";
import { CustomTokensExample, ModeExamples, StructureExample, TooltipExample } from "./SidebarExamples";
import { SIDEBAR_DEMO_SECTIONS, SIDEBAR_EVENT_LOG_DESCRIPTION } from "./sidebar-sections";

type SectionDemo = (record: RecordDemoEvent) => ReactNode;

const SECTION_DEMOS: Record<string, SectionDemo> = {
  structure: (record) => <StructureExample record={record} />,
  modes: (record) => <ModeExamples record={record} />,
  tooltips: (record) => <TooltipExample record={record} />,
  custom: (record) => <CustomTokensExample record={record} />,
};

const SidebarDemoHeader = () => (
  <div className="rounded-lg border bg-card p-4">
    <h2 className="text-lg font-semibold">Menú lateral</h2>
    <p className="mt-2 text-xs text-muted-foreground">
      Cada ejemplo vive en un marco de 480 px, para probar el scroll interno sin depender de la ventana.
    </p>
  </div>
);

export const SidebarMock = () => {
  const { events, record } = useDemoEventLog();
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
      <div className="min-w-0 flex-1 space-y-4">
        <SidebarDemoHeader />
        {SIDEBAR_DEMO_SECTIONS.map((section) => (
          <SidebarDemoSection key={section.id} section={section}>
            {SECTION_DEMOS[section.id](record)}
          </SidebarDemoSection>
        ))}
      </div>
      <DemoEventLog events={events} description={SIDEBAR_EVENT_LOG_DESCRIPTION} />
    </div>
  );
};
