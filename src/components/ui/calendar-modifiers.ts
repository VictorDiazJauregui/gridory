import type { Modifiers } from "react-day-picker";

export const rangeAttributes = (modifiers: Modifiers) => ({
  "data-range-start": modifiers.range_start || undefined,
  "data-range-middle": modifiers.range_middle || undefined,
  "data-range-end": modifiers.range_end || undefined,
});

export const isSingleSelection = (modifiers: Modifiers) =>
  modifiers.selected &&
  !modifiers.range_start &&
  !modifiers.range_end &&
  !modifiers.range_middle;
