import { isValid, parse } from "date-fns";
import { describe, expect, it } from "vitest";
import type { DateInputFormat } from "../components/shared/data-model";
import { parseInputToDate } from "../components/shared/date-pickers/date-mask";

const MASKS: DateInputFormat[] = ["dd/mm/yyyy", "dd-mm-yyyy", "mm/dd/yyyy", "mm-dd-yyyy"];
const FIRST_FIELDS = ["0", "00", "1", "01", "9", "12", "13", "28", "29", "30", "31", "32", "001", "99", "100", "0000",
  "1900", "2000", "2023", "2024", "9999", "12345", "24", "024"];
const SECOND_FIELDS = ["1", "02", "12", "29", "31", "13"];
const YEAR_FIELDS = ["2024", "2023", "1", "0", "24", "10000"];
const SEPARATORS = ["/", "-", ".", " ", ""];
const TRAILING_TEXTS = ["", " ", "  ", "x", " 1", "/"];
// Days whose local midnight did not exist (Santiago 2024, São Paulo 2018, Buenos Aires 2008), in both field orders.
const DAYLIGHT_SAVING_TEXTS = ["08/09/2024", "09/08/2024", "04/11/2018", "11/04/2018", "19/10/2008", "10/19/2008"];
const LOOSE_TEXTS = ["", " ", "abc", "//", "1/1", "31/12/2024/1", " 05/06/2024 ", "+1/2/2024", "-1/2/2024"];

const parseWithDateFns = (text: string, mask: DateInputFormat) => {
  const trimmed = text.trim();
  if (!trimmed) return undefined;
  const parsed = parse(trimmed, mask.replace("mm", "MM"), new Date());
  return isValid(parsed) ? parsed : undefined;
};

const appendEach = (prefixes: string[], suffixes: string[]) =>
  prefixes.flatMap((prefix) => suffixes.map((suffix) => `${prefix}${suffix}`));

const buildTypedTexts = () =>
  SEPARATORS.flatMap((separator) => {
    const dayAndMonth = appendEach(appendEach(FIRST_FIELDS, [separator]), appendEach(SECOND_FIELDS, [separator]));
    return appendEach(appendEach(dayAndMonth, YEAR_FIELDS), TRAILING_TEXTS);
  }).concat(LOOSE_TEXTS, DAYLIGHT_SAVING_TEXTS);

describe("parseInputToDate matches date-fns parse", () => {
  it.each(MASKS)("for every generated text with %s", (mask) => {
    for (const text of buildTypedTexts()) {
      expect({ text, time: parseInputToDate(text, mask)?.getTime() })
        .toEqual({ text, time: parseWithDateFns(text, mask)?.getTime() });
    }
  });
});
