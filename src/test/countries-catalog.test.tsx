import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import {
  CountryFlag,
  findCountryByDialCode,
  getCountryName,
  getDialCode,
  isCountryCode,
  listCountries,
  type CountryCode,
  type FlagUrlResolver,
} from "../countries";
import { COUNTRY_CODES } from "../components/shared/countries/country-codes";
import { DIAL_CODE_BY_COUNTRY } from "../components/shared/countries/dial-codes";

const EXPECTED_SHARED_DIAL_CODE_COUNTRIES = {
  "+1": "US",
  "+7": "RU",
  "+39": "IT",
  "+44": "GB",
  "+47": "NO",
  "+61": "AU",
  "+64": "NZ",
  "+212": "MA",
  "+262": "RE",
  "+358": "FI",
  "+500": "FK",
  "+590": "GP",
  "+599": "CW",
  "+672": "NF",
};

const resolveTestFlagUrl: FlagUrlResolver = (code, width) => `/flags/${code}-${width}.svg`;

const groupCountriesByDialCode = (): Map<string, CountryCode[]> => {
  const groups = new Map<string, CountryCode[]>();
  for (const code of COUNTRY_CODES) {
    const dialCode = DIAL_CODE_BY_COUNTRY[code];
    if (dialCode) groups.set(dialCode, [...(groups.get(dialCode) ?? []), code]);
  }
  return groups;
};

const sharedDialCodeGroups = () => [...groupCountriesByDialCode()].filter(([, codes]) => codes.length > 1);

test("getCountryName localizes with Intl, in Spanish by default", () => {
  expect(getCountryName("PE")).toBe("Perú");
  expect(getCountryName("PE", "es")).toBe("Perú");
  expect(getCountryName("PE", "en")).toBe("Peru");
  expect(getCountryName("DE", "en")).toBe("Germany");
});

test("getDialCode returns the calling code, and nothing for the three territories without one", () => {
  expect(getDialCode("PE")).toBe("+51");
  expect(getDialCode("CA")).toBe("+1");
  expect([getDialCode("BV"), getDialCode("HM"), getDialCode("TF")]).toEqual([undefined, undefined, undefined]);
});

test("findCountryByDialCode accepts the code with or without + and ignores spaces", () => {
  expect(findCountryByDialCode("+51")).toBe("PE");
  expect(findCountryByDialCode("51")).toBe("PE");
  expect(findCountryByDialCode(" + 51 ")).toBe("PE");
  expect(findCountryByDialCode("+598")).toBe("UY");
});

test("findCountryByDialCode returns nothing for unknown or malformed codes", () => {
  for (const dialCode of ["+999", "", "+", "abc", "+5a1", "++51"]) {
    expect(findCountryByDialCode(dialCode), dialCode).toBeUndefined();
  }
});

test("a dial code used by one country finds that country", () => {
  const uniqueGroups = [...groupCountriesByDialCode()].filter(([, codes]) => codes.length === 1);
  expect(uniqueGroups).toHaveLength(190);
  for (const [dialCode, [code]] of uniqueGroups) expect(findCountryByDialCode(dialCode), dialCode).toBe(code);
});

test("the 14 shared dial codes find their most populous country, from a fixed table", () => {
  const shared = Object.fromEntries(sharedDialCodeGroups().map(([dialCode]) => [dialCode, findCountryByDialCode(dialCode)]));
  expect(shared).toEqual(EXPECTED_SHARED_DIAL_CODE_COUNTRIES);
});

test("every shared dial code has a representative that really uses it", () => {
  for (const [dialCode, codes] of sharedDialCodeGroups()) {
    const representative = findCountryByDialCode(dialCode);
    expect(representative && codes.includes(representative), dialCode).toBe(true);
  }
});

test("listCountries returns the 249 countries sorted by name, the same list on every call", () => {
  const countries = listCountries();
  expect(countries).toHaveLength(249);
  expect(countries[0]).toEqual({ code: "AF", name: "Afganistán", dialCode: "+93" });
  expect(listCountries("es")).toBe(countries);
  expect(listCountries("en").find((country) => country.code === "PE")?.name).toBe("Peru");
});

test("isCountryCode guards strings that come from a database", () => {
  expect([isCountryCode("PE"), isCountryCode("pe"), isCountryCode("XK"), isCountryCode("")]).toEqual([true, false, false, false]);
});

test("CountryFlag draws a 20×15 flagcdn image with an empty alt by default", () => {
  const { container } = render(<CountryFlag code="PE" />);
  const flag = container.querySelector("img");
  expect(flag).toHaveAttribute("src", "https://flagcdn.com/w20/pe.png");
  expect(flag).toHaveAttribute("srcset", "https://flagcdn.com/w40/pe.png 2x");
  expect(flag).toHaveAttribute("alt", "");
  expect(flag).toHaveAttribute("width", "20");
  expect(flag).toHaveAttribute("height", "15");
  expect(flag).toHaveClass("gdy-country-flag");
});

test("CountryFlag takes a label, its own flag URL and an extra class", () => {
  render(<CountryFlag code="CA" label="Canadá" flagUrl={resolveTestFlagUrl} className="my-flag" />);
  const flag = screen.getByRole("img", { name: "Canadá" });
  expect(flag).toHaveAttribute("src", "/flags/CA-20.svg");
  expect(flag).toHaveAttribute("srcset", "/flags/CA-40.svg 2x");
  expect(flag).toHaveClass("gdy-country-flag", "my-flag");
});
