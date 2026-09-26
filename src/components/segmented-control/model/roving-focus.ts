import type { KeyboardEvent } from "react";
import type { SegmentedOption } from "../types";
import { resolveNextIndex } from "./next-index";
import { listOptionElements } from "./option-elements";

const NO_SELECTED_INDEX = -1;
const FIRST_INDEX = 0;

/** The chosen option holds the group's only tab stop; with none chosen, the first one does. */
export const resolveTabStopIndex = (selectedIndex: number): number =>
  selectedIndex === NO_SELECTED_INDEX ? FIRST_INDEX : selectedIndex;

// A modified arrow or Home/End belongs to the browser or the OS (Alt+← goes
// back in history), so only the bare keys move through the group.
const hasModifierKey = (event: KeyboardEvent) =>
  event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;

// Every option is a direct child of the radiogroup, so the focused option's
// parent is the group: no ref has to reach the handler.
const focusOption = (currentOption: HTMLElement, index: number) => {
  const root = currentOption.parentElement;
  if (!root) return;
  listOptionElements(root)[index]?.focus();
};

export const createOptionKeyDownHandler =
  (options: SegmentedOption[], selectValue: (value: string) => void) =>
  (currentIndex: number) =>
  (event: KeyboardEvent<HTMLElement>) => {
    const nextIndex = resolveNextIndex(event.key, currentIndex, options.length);
    if (nextIndex === null || hasModifierKey(event)) return;
    event.preventDefault();
    selectValue(options[nextIndex].value);
    focusOption(event.currentTarget, nextIndex);
  };
