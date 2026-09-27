import { expect, test } from "vitest";
import {
  assertValidSelectionRange,
  hasReachedMaximum,
  isBelowMinimum,
  toggleCountry,
  type SelectionRange,
} from "../components/country-select/model/selection-range";
import { countVisibleChips } from "../components/country-select/model/visible-chip-count";
import { InvalidSelectionRangeError } from "../components/country-select/validation/selection-range-errors";
import type { CountryCode } from "../components/shared/countries/country-codes";

const UNBOUNDED_RANGE: SelectionRange = { minSelected: 1, maxSelected: Infinity };
const UP_TO_THREE: SelectionRange = { minSelected: 2, maxSelected: 3 };

const readRangeError = (range: SelectionRange): unknown => {
  try {
    assertValidSelectionRange(range);
  } catch (error) {
    return error;
  }
  return undefined;
};

test("a range whose minimum does not exceed its maximum is valid, unbounded included", () => {
  expect(() => assertValidSelectionRange(UNBOUNDED_RANGE)).not.toThrow();
  expect(() => assertValidSelectionRange({ minSelected: 3, maxSelected: 3 })).not.toThrow();
});

test("a minimum above the maximum throws InvalidSelectionRangeError naming both values", () => {
  const error = readRangeError({ minSelected: 4, maxSelected: 2 });
  expect(error).toBeInstanceOf(InvalidSelectionRangeError);
  expect(error).toMatchObject({ name: "InvalidSelectionRangeError" });
  expect((error as Error).message).toMatch(/4/);
  expect((error as Error).message).toMatch(/2/);
});

test("the maximum is reached at maxSelected and never without a limit", () => {
  expect([2, 3, 4].map((count) => hasReachedMaximum(count, UP_TO_THREE))).toEqual([false, true, true]);
  expect(hasReachedMaximum(249, UNBOUNDED_RANGE)).toBe(false);
});

test("below the minimum means some countries but fewer than minSelected; none is not below", () => {
  expect([0, 1, 2].map((count) => isBelowMinimum(count, UP_TO_THREE))).toEqual([false, true, false]);
});

test("toggling appends a new country at the end and removes a chosen one", () => {
  expect(toggleCountry(["PE", "CL"], "AR", UNBOUNDED_RANGE)).toEqual(["PE", "CL", "AR"]);
  expect(toggleCountry(["PE", "CL", "AR"], "CL", UNBOUNDED_RANGE)).toEqual(["PE", "AR"]);
});

test("at the maximum a new country is not added, while a chosen one can still be removed", () => {
  const full: CountryCode[] = ["PE", "CL", "AR"];
  expect(toggleCountry(full, "MX", UP_TO_THREE)).toEqual(["PE", "CL", "AR"]);
  expect(toggleCountry(full, "PE", UP_TO_THREE)).toEqual(["CL", "AR"]);
});

test("toggling never mutates the received selection and always returns a new array", () => {
  const selected = Object.freeze<CountryCode[]>(["PE", "CL", "AR"]);
  expect(toggleCountry(selected, "MX", UP_TO_THREE)).not.toBe(selected);
  expect(toggleCountry(selected, "PE", UP_TO_THREE)).not.toBe(selected);
  expect(selected).toEqual(["PE", "CL", "AR"]);
});

test("every chip is visible when all of them fit, gaps included", () => {
  const measure = { chipWidths: [50, 50, 50], moreBadgeWidth: 30, gap: 5 };
  expect(countVisibleChips({ ...measure, availableWidth: 160 })).toBe(3);
  expect(countVisibleChips({ ...measure, availableWidth: 159 })).toBe(2);
});

test("when not every chip fits, room is left for the +N badge and its gap", () => {
  const measure = { chipWidths: [50, 50, 50, 50], moreBadgeWidth: 30, gap: 5 };
  expect(countVisibleChips({ ...measure, availableWidth: 140 })).toBe(2);
  expect(countVisibleChips({ ...measure, availableWidth: 139 })).toBe(1);
});

test("no chip is visible when the first one and the badge do not fit, and the count is never negative", () => {
  const measure = { chipWidths: [80, 80], moreBadgeWidth: 30, gap: 4 };
  expect(countVisibleChips({ ...measure, availableWidth: 100 })).toBe(0);
  expect(countVisibleChips({ ...measure, availableWidth: 10 })).toBe(0);
});

test("the gap between chips counts against the available width", () => {
  const chipWidths = [40, 40, 40];
  expect(countVisibleChips({ chipWidths, availableWidth: 120, moreBadgeWidth: 20, gap: 0 })).toBe(3);
  expect(countVisibleChips({ chipWidths, availableWidth: 120, moreBadgeWidth: 20, gap: 8 })).toBe(2);
});
