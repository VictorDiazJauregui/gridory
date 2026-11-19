import { expect, test } from "vitest";
import { InvalidMaxNumberLengthError } from "../components/phone-input";
import { assertValidMaxNumberLength, limitNumberLength } from "../components/phone-input/model/number-length-limit";

test("without a maximum every number passes", () => {
  expect(limitNumberLength({ next: "1234567890123", current: "", max: undefined })).toBe("1234567890123");
});

test("a number within the maximum passes", () => {
  expect(limitNumberLength({ next: "987654321", current: "98765432", max: 9 })).toBe("987654321");
});

test("a shorter number passes even above the maximum, so an old long value can be shortened", () => {
  expect(limitNumberLength({ next: "98765432191234567", current: "987654321912345678", max: 9 })).toBe("98765432191234567");
});

test("a longer number is rejected once the current one reached the maximum", () => {
  expect(limitNumberLength({ next: "9876543210", current: "987654321", max: 9 })).toBeNull();
  expect(limitNumberLength({ next: "9876543219123456780", current: "987654321912345678", max: 9 })).toBeNull();
});

test("a longer number is cut to the maximum while there was room left", () => {
  expect(limitNumberLength({ next: "987654321000", current: "", max: 9 })).toBe("987654321");
  expect(limitNumberLength({ next: "98765432100", current: "98765", max: 9 })).toBe("987654321");
});

test.each([0, -3, 2.5, Number.NaN, Infinity])("maxNumberLength %s is not a whole number from 1: it throws", (max) => {
  expect(() => assertValidMaxNumberLength(max)).toThrow(InvalidMaxNumberLengthError);
});

test("a missing or whole maximum is valid", () => {
  expect(() => assertValidMaxNumberLength(undefined)).not.toThrow();
  expect(() => assertValidMaxNumberLength(1)).not.toThrow();
  expect(() => assertValidMaxNumberLength(15)).not.toThrow();
});
