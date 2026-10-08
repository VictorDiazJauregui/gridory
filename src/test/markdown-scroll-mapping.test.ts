import { expect, test } from "vitest";
import { mapLineToOffset, mapOffsetToLine } from "../components/markdown-editor/sync-scroll/scroll-mapping";

const BLOCKS = [
  { line: 1, top: 0 },
  { line: 3, top: 40 },
  { line: 5, top: 800 },
  { line: 6, top: 840 },
];
const CONTENT_HEIGHT = 1000;

test.each([
  { line: 1, offset: 0 },
  { line: 3, offset: 40 },
  { line: 4, offset: 420 },
  { line: 5.5, offset: 820 },
  { line: 6.5, offset: 920 },
])("maps source line $line to preview offset $offset", ({ line, offset }) => {
  expect(mapLineToOffset(BLOCKS, line, CONTENT_HEIGHT)).toBeCloseTo(offset);
});

test.each([
  { offset: 0, line: 1 },
  { offset: 420, line: 4 },
  { offset: 820, line: 5.5 },
  { offset: 990, line: 6.9375 },
])("maps preview offset $offset to source line $line", ({ offset, line }) => {
  expect(mapOffsetToLine(BLOCKS, offset, CONTENT_HEIGHT)).toBeCloseTo(line);
});

test("an empty document maps to the top", () => {
  expect(mapLineToOffset([], 10, CONTENT_HEIGHT)).toBe(0);
  expect(mapOffsetToLine([], 300, CONTENT_HEIGHT)).toBe(1);
});
