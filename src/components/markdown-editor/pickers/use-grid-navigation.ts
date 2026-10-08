import type { KeyboardEvent } from "react";

const readColumnCount = (grid: HTMLElement): number =>
  Math.max(1, getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length);

const STEPS: Record<string, (columns: number) => number> = {
  ArrowRight: () => 1,
  ArrowLeft: () => -1,
  ArrowDown: (columns) => columns,
  ArrowUp: (columns) => -columns,
};

export const moveFocusInGrid = (event: KeyboardEvent<HTMLElement>) => {
  const readStep = STEPS[event.key];
  if (!readStep) return;
  const cells = [...event.currentTarget.querySelectorAll<HTMLElement>("button")];
  const current = cells.indexOf(document.activeElement as HTMLElement);
  const target = cells[current + readStep(readColumnCount(event.currentTarget))];
  if (current === -1 || !target) return;
  event.preventDefault();
  target.focus();
};
