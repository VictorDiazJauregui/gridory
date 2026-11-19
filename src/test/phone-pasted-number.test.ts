import { expect, test } from "vitest";
import { splitPastedInternationalNumber } from "../components/phone-input/model/pasted-international-number";
import type { PastedNumberRules } from "../components/phone-input/model/pasted-international-number";
import { matchLeadingDialCode } from "../components/shared/countries/dial-code-prefix";

const PHONE: PastedNumberRules = { characters: "phone", maxLength: undefined };
const DIGITS: PastedNumberRules = { characters: "digits", maxLength: undefined };
const DIGITS_UP_TO_9: PastedNumberRules = { characters: "digits", maxLength: 9 };

test("matchLeadingDialCode finds the longest known dial code right after the +", () => {
  expect(matchLeadingDialCode("+51 987")).toEqual({ dialCode: "+51", rest: " 987" });
  expect(matchLeadingDialCode("  +51987654321")).toEqual({ dialCode: "+51", rest: "987654321" });
  expect(matchLeadingDialCode("+598 99")).toEqual({ dialCode: "+598", rest: " 99" });
  expect(matchLeadingDialCode("+1 (416) 555-0100")).toEqual({ dialCode: "+1", rest: " (416) 555-0100" });
});

test("matchLeadingDialCode needs a + and a known code", () => {
  expect(matchLeadingDialCode("51 987")).toBeUndefined();
  expect(matchLeadingDialCode("0051 987")).toBeUndefined();
  expect(matchLeadingDialCode("+999 123")).toBeUndefined();
  expect(matchLeadingDialCode("+ 51 987")).toBeUndefined();
  expect(matchLeadingDialCode("")).toBeUndefined();
});

test("E-5: the phone rule moves +51 to the country and keeps the separators of the number", () => {
  expect(splitPastedInternationalNumber("+51 987 654 321", { country: null, rules: PHONE })).toEqual({ country: "PE", number: "987 654 321" });
});

test("E-6: the digits rule leaves the local number only", () => {
  expect(splitPastedInternationalNumber("+51 987 654 321", { country: null, rules: DIGITS })).toEqual({ country: "PE", number: "987654321" });
});

test("E-7: a chosen country that shares the dial code is kept", () => {
  expect(splitPastedInternationalNumber("+1 (416) 555-0100", { country: "CA", rules: DIGITS })).toEqual({ country: "CA", number: "4165550100" });
});

test("E-8: another country gives way to the representative of the dial code", () => {
  expect(splitPastedInternationalNumber("+1 416 555 0100", { country: "PE", rules: DIGITS })).toEqual({ country: "US", number: "4165550100" });
});

test("E-9 and E-16: an unknown code or one without + is not split", () => {
  expect(splitPastedInternationalNumber("+999 123", { country: "PE", rules: DIGITS })).toBeUndefined();
  expect(splitPastedInternationalNumber("0051 987 654 321", { country: null, rules: PHONE })).toBeUndefined();
});

test("E-12: the local number is cut to the maximum", () => {
  expect(splitPastedInternationalNumber("+51 987 654 321 000", { country: null, rules: DIGITS_UP_TO_9 })).toEqual({ country: "PE", number: "987654321" });
});

test("the separators left between the code and the number are dropped", () => {
  expect(splitPastedInternationalNumber("+51 - 987-654", { country: null, rules: PHONE })).toEqual({ country: "PE", number: "987-654" });
});
