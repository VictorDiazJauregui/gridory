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
