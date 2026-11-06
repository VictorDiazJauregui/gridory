import { expect, test } from "vitest";

// An app that only imports gridory/table or gridory/kanban must not receive a byte of the card grid: the
// shared code goes from the card grid to them, never the other way.
const VIEW_SOURCES = import.meta.glob<string>(
  ["../components/table/**/*.{ts,tsx}", "../components/kanban/**/*.{ts,tsx}", "../components/shared/**/*.{ts,tsx}"],
  { query: "?raw", import: "default", eager: true },
);
const CARD_GRID_IMPORT = /from\s+["'][^"']*card-grid[^"']*["']/;

test("the table, the kanban and the shared layer never import the card grid", () => {
  const importers = Object.entries(VIEW_SOURCES)
    .filter(([, source]) => CARD_GRID_IMPORT.test(source))
    .map(([file]) => file);
  expect(Object.keys(VIEW_SOURCES).length).toBeGreaterThan(100);
  expect(importers).toEqual([]);
});

test("gridory/card-grid exposes the component", async () => {
  const entry = await import("../card-grid");
  expect(entry).toHaveProperty("CardGrid");
  expect(entry).not.toHaveProperty("DataTable");
  expect(entry).not.toHaveProperty("KanbanBoard");
});
