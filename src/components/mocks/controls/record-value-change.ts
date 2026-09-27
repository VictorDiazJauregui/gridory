import type { RecordDemoEvent } from "../shared/use-demo-event-log";

export interface RecordingExampleProps {
  record: RecordDemoEvent;
}

export const recordValueChange = (record: RecordDemoEvent, control: string) => (value: unknown) =>
  record("onValueChange", { control, value });
