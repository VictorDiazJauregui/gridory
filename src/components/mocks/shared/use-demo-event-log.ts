import { useRef, useState } from "react";

export interface DemoEvent {
  id: number;
  type: string;
  payload?: unknown;
}

export type RecordDemoEvent = (type: string, payload?: unknown) => void;

const MAX_EVENTS = 8;

export const useDemoEventLog = () => {
  const [events, setEvents] = useState<DemoEvent[]>([]);
  const nextId = useRef(0);
  const record: RecordDemoEvent = (type, payload) => {
    nextId.current += 1;
    const event = { id: nextId.current, type, payload };
    setEvents((current) => [event, ...current].slice(0, MAX_EVENTS));
  };
  return { events, record };
};
