import { parse } from "date-fns";
import { describe, expect, it, vi } from "vitest";
import { parseInputToDate } from "../components/shared/date-pickers/date-mask";

vi.mock("date-fns", async (importOriginal) => ({
  ...(await importOriginal<typeof import("date-fns")>()),
  parse: vi.fn(),
}));

describe("parseInputToDate", () => {
  it("reads a typed date without date-fns parse", () => {
    expect(parseInputToDate("29/02/2024", "dd/mm/yyyy")).toEqual(new Date(2024, 1, 29));
    expect(parse).not.toHaveBeenCalled();
  });
});
