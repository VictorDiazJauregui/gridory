import { beforeAll } from "vitest";

// The first import of the calendar compiles react-day-picker and date-fns in the test runner, which can outlast a
// findBy* under a full run: files that wait for the date inputs pay that cost up front.
export const warmDatePickersBeforeAll = () =>
  beforeAll(async () => {
    await import("../components/shared/date-pickers/date-pickers-bundle");
  });
