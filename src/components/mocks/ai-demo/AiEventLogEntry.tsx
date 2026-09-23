import type { AIActionEvent } from "../../ai";

interface AiEventLogEntryProps {
  event: AIActionEvent;
}

export const AiEventLogEntry = ({ event }: AiEventLogEntryProps) => (
  <div className="rounded border bg-muted p-2">
    <p className="text-[11px] font-medium text-foreground">{event.type}</p>
    <pre className="mt-1 overflow-x-auto text-[10px] text-muted-foreground">
      {JSON.stringify(event.payload, null, 2)}
    </pre>
  </div>
);
