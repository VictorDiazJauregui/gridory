import { InvalidMaxNumberLengthError } from "../validation/number-length-errors";

export interface NumberLengthChange {
  next: string;
  /** The number before the change, filtered by the same character rule as `next`. */
  current: string;
  max: number | undefined;
}

/** The number to keep, or null when the change is refused. A shorter number always passes. */
export const limitNumberLength = ({ next, current, max }: NumberLengthChange): string | null => {
  if (max === undefined || next.length <= max) return next;
  if (next.length < current.length) return next;
  if (current.length >= max) return null;
  return next.slice(0, max);
};

export const assertValidMaxNumberLength = (max: number | undefined): void => {
  if (max === undefined || (Number.isInteger(max) && max >= 1)) return;
  throw new InvalidMaxNumberLengthError(max);
};
