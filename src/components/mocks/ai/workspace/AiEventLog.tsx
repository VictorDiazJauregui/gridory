import type { AIActionEvent } from "../../../ai";
import { AiEventLogEntry } from "./AiEventLogEntry";

interface AiEventLogProps {
  events: AIActionEvent[];
}

export const AiEventLog = ({ events }: AiEventLogProps) => (
  <div className="rounded-gdy-lg border bg-gdy-card p-3">
    <h3 className="text-sm font-semibold">Últimos eventos</h3>
    <div className="mt-2 space-y-2">
      {events.length === 0 ? (
        <p className="text-xs text-gdy-muted-foreground">Aún no hay eventos.</p>
      ) : (
        events.map((event, index) => (
          <AiEventLogEntry key={`${event.type}-${index}`} event={event} />
        ))
      )}
    </div>
  </div>
);
