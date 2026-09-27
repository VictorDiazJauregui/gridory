import type { RecordDemoEvent } from "../shared/use-demo-event-log";
import { CUSTOM_TOKENS_EXAMPLE, MODE_EXAMPLES, STRUCTURE_EXAMPLE, TOOLTIP_EXAMPLE } from "./sidebar-examples";
import { SidebarFrame } from "./SidebarFrame";
import type { SidebarFrameConfig } from "./SidebarFrame";

interface ExampleProps {
  record: RecordDemoEvent;
}

const TitledFrame = ({ config, record }: ExampleProps & { config: SidebarFrameConfig }) => (
  <div className="min-w-0 space-y-2">
    <h4 className="text-xs font-medium text-muted-foreground">{config.name}</h4>
    <SidebarFrame config={config} record={record} />
  </div>
);

export const StructureExample = ({ record }: ExampleProps) => <TitledFrame config={STRUCTURE_EXAMPLE} record={record} />;

export const ModeExamples = ({ record }: ExampleProps) => (
  <div className="grid gap-4 lg:grid-cols-2">
    {MODE_EXAMPLES.map((config) => (
      <TitledFrame key={config.name} config={config} record={record} />
    ))}
  </div>
);

export const TooltipExample = ({ record }: ExampleProps) => <TitledFrame config={TOOLTIP_EXAMPLE} record={record} />;

export const CustomTokensExample = ({ record }: ExampleProps) => <TitledFrame config={CUSTOM_TOKENS_EXAMPLE} record={record} />;
