import { useDemoText } from "./demo-dictionary";
import type { DemoEvent } from "./use-demo-event-log";

interface DemoEventLogProps {
  events: DemoEvent[];
  description: string;
}

const DemoEventItem = ({ event }: { event: DemoEvent }) => (
  <div className="rounded border bg-muted p-2">
    <p className="text-[11px] font-medium text-foreground">{event.type}</p>
    {event.payload !== undefined && (
      <pre className="mt-1 overflow-x-auto text-[10px] text-muted-foreground">
        {JSON.stringify(event.payload, null, 2)}
      </pre>
    )}
  </div>
);

export const DemoEventLog = ({ events, description }: DemoEventLogProps) => {
  const translate = useDemoText();
  return (
    <aside className="w-full shrink-0 rounded-lg border bg-card p-3 xl:w-80">
      <h3 className="text-sm font-semibold">{translate("Eventos emitidos")}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      <div className="mt-3 space-y-2">
        {events.length === 0 && <p className="text-xs text-muted-foreground">{translate("Aún no hay eventos.")}</p>}
        {events.map((event) => (
          <DemoEventItem key={event.id} event={event} />
        ))}
      </div>
    </aside>
  );
};
