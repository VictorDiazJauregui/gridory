import { act, render, renderHook, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { DemoEventLog } from "../components/mocks/shared/DemoEventLog";
import { useDemoEventLog } from "../components/mocks/shared/use-demo-event-log";

const recordEvents = (count: number) => {
  const { result } = renderHook(() => useDemoEventLog());
  act(() => {
    for (let index = 1; index <= count; index += 1) result.current.record(`event-${index}`);
  });
  return result.current.events;
};

test("keeps the newest event first and at most eight of them", () => {
  const events = recordEvents(9);
  expect(events).toHaveLength(8);
  expect(events[0].type).toBe("event-9");
  expect(events.at(-1)?.type).toBe("event-2");
});

test("shows the page's own description and each payload", () => {
  const events = [{ id: 1, type: "onSubmit", payload: { email: "a@b.co" } }];
  render(<DemoEventLog events={events} description="Descripción de la página." />);
  expect(screen.getByText("Descripción de la página.")).toBeInTheDocument();
  expect(screen.getByText("onSubmit")).toBeInTheDocument();
  expect(screen.getByText(/"email": "a@b.co"/)).toBeInTheDocument();
});
