import { DemoEventLog } from "../shared/DemoEventLog";
import { useDemoEventLog } from "../shared/use-demo-event-log";
import { ControlsScrollArea } from "./ControlsScrollArea";
import { ControlsSection } from "./ControlsSection";
import { CONTROLS_SECTIONS, EVENT_LOG_DESCRIPTION } from "./controls-sections";

const ControlsHeader = () => (
  <div className="rounded-lg border bg-card p-4">
    <h2 className="text-lg font-semibold">Controles</h2>
    <p className="mt-2 text-xs text-muted-foreground">
      Cada control se exporta por separado; aquí conviven para probarlos juntos, en claro y en oscuro.
    </p>
  </div>
);

export const ControlsMock = () => {
  const { events } = useDemoEventLog();
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
      <div className="min-w-0 flex-1 space-y-4">
        <ControlsHeader />
        {CONTROLS_SECTIONS.map((section) => (
          <ControlsSection key={section.id} section={section} />
        ))}
        <ControlsScrollArea />
      </div>
      <DemoEventLog events={events} description={EVENT_LOG_DESCRIPTION} />
    </div>
  );
};
