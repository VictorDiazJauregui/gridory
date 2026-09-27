import { expect, test, vi } from "vitest";

// openai is an optional peer dependency: an app that never imports gridory/ai
// may not have it installed, so loading the root entry must never reach it.
vi.mock("openai", () => {
  throw new Error("The root entry must not load the openai SDK");
});

// Loading the whole library is slow under a full parallel run, so it happens
// once while the file is collected instead of inside a timed test.
const rootEntry = await import("../index");

test("the root entry loads without the openai SDK", () => {
  expect(rootEntry).toHaveProperty("DataTable");
  expect(rootEntry).toHaveProperty("KanbanBoard");
});

test("the root entry leaves the AI assistant to gridory/ai", () => {
  expect(rootEntry).not.toHaveProperty("AIChatSidebar");
  expect(rootEntry).not.toHaveProperty("useAIChat");
});
