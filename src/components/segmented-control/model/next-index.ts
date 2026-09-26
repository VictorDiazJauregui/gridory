import { ARROW_KEY_STEPS } from "../constants";

/**
 * Index of the option a key moves to, or `null` when the key does not move.
 * Arrows wrap around the ends, as in a native radio group.
 */
export const resolveNextIndex = (key: string, currentIndex: number, optionCount: number): number | null => {
  if (optionCount === 0) return null;
  if (key === "Home") return 0;
  if (key === "End") return optionCount - 1;
  if (!Object.hasOwn(ARROW_KEY_STEPS, key)) return null;
  return (currentIndex + ARROW_KEY_STEPS[key] + optionCount) % optionCount;
};
