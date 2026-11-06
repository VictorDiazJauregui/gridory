import { createDeferredModule } from "../deferred/deferred-module";

// The calendar is among the heaviest pieces of the table and the kanban, and only shows
// once a date operator is chosen: it downloads when a date filter opens, not with the page.
export const deferredDatePickers = createDeferredModule(() => import("./date-pickers-bundle"));

export type DatePickersBundle = Awaited<ReturnType<typeof deferredDatePickers.load>>;
