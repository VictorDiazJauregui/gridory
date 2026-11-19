import { expect, test } from "vitest";
import { sanitizePhoneNumber } from "../components/phone-input/model/phone-number-rules";

test.each([
  ["abc 999-111", " 999-111"],
  ["áéíóú ñ 51", "  51"],
  ["51\t999\n111", "51999111"],
  ["😀+51😀", "+51"],
  ["999 111 222", "999 111 222"],
  ["+51 999-111-222", "+51 999-111-222"],
  ["(01) 555.1234", "01 5551234"],
  ["", ""],
])("sanitizePhoneNumber(%j) keeps digits, spaces, hyphens and + only: %j", (text, expected) => {
  expect(sanitizePhoneNumber(text)).toBe(expected);
});

test.each([
  ["abc 999-111", " 999-111"],
  ["+51 999-111-222", "+51 999-111-222"],
])("the phone rule, named, is the 2.2.0 one: %j becomes %j", (text, expected) => {
  expect(sanitizePhoneNumber(text, "phone")).toBe(expected);
});

test.each([
  ["98a7-65 4/3", "9876543"],
  ["+51 987 654 321", "51987654321"],
  ["(01) 555.1234", "015551234"],
  ["😀 ñ", ""],
])("the digits rule keeps digits only: %j becomes %j", (text, expected) => {
  expect(sanitizePhoneNumber(text, "digits")).toBe(expected);
});
