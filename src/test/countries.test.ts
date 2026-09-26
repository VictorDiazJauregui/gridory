import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { expect, test } from "vitest";
import { COUNTRY_CODES, isCountryCode } from "../components/shared/countries/country-codes";
import { CountryFlag } from "../components/shared/countries/CountryFlag";
import {
  DEFAULT_COUNTRY_FLAG_SETTINGS,
  resolveFlagcdnUrl,
  type FlagUrlResolver,
} from "../components/shared/countries/country-flag-url";
import { buildCountryList } from "../components/shared/countries/country-list";
import {
  buildDialCodeOptions,
  matchesCountryOption,
  toCountryOption,
  toDialCodeOption,
  type CountryWithDialCode,
} from "../components/shared/countries/country-listbox-options";
import { matchesCountryQuery } from "../components/shared/countries/country-search";

const countries = buildCountryList();

const PERU: CountryWithDialCode = { code: "PE", name: "Perú", dialCode: "+51" };

const findCountry = (code: string) => countries.find((country) => country.code === code);

const findMatchingCountries = (query: string) =>
  countries.filter((country) => matchesCountryQuery(country, query));

const findMatchingCodes = (query: string) =>
  findMatchingCountries(query).map((country) => country.code);

const resolveTestFlagUrl: FlagUrlResolver = (code, width) => `/flags/${code}-${width}.svg`;

test("the codes are the 249 official ISO ones: unique, without Kosovo and with BQ", () => {
  expect(COUNTRY_CODES).toHaveLength(249);
  expect(new Set(COUNTRY_CODES).size).toBe(249);
  expect(COUNTRY_CODES).not.toContain("XK");
  expect(COUNTRY_CODES).toContain("BQ");
  expect([isCountryCode("PE"), isCountryCode("XK"), isCountryCode("pe")]).toEqual([true, false, false]);
});

test("every code gets its own name from Intl", () => {
  expect(countries).toHaveLength(COUNTRY_CODES.length);
  const unnamed = countries.filter((country) => !country.name || country.name === country.code);
  expect(unnamed).toEqual([]);
});

test("the list is sorted by name with the Spanish collation", () => {
  const names = countries.map((country) => country.name);
  expect(names).toEqual([...names].sort((first, second) => first.localeCompare(second, "es")));
});

test("only BV, HM and TF have no dial code", () => {
  const withoutDialCode = countries.filter((country) => !country.dialCode).map((country) => country.code);
  expect(withoutDialCode.sort()).toEqual(["BV", "HM", "TF"]);
  expect(findCountry("BQ")?.dialCode).toBe("+599");
  expect(findCountry("PE")?.dialCode).toBe("+51");
});

test("a name is found ignoring case, accents and surrounding spaces", () => {
  expect(findMatchingCodes("peru")).toContain("PE");
  expect(findMatchingCodes("PERÚ")).toContain("PE");
  expect(findMatchingCodes(" perú ")).toContain("PE");
  expect(findMatchingCodes("mexico")).toContain("MX");
  expect(findMatchingCodes("japon")).toContain("JP");
  expect(findMatchingCodes("espana")).toContain("ES");
  expect(findMatchingCodes("reino unido")).toContain("GB");
});

test("the ISO code matches only when the query is exactly the code", () => {
  expect(findMatchingCodes("pe")).toContain("PE");
  expect(findMatchingCodes("DE")).toContain("DE");
  expect(findMatchingCodes("d")).not.toContain("DE");
});

test("digits find the countries whose dial code starts with them", () => {
  expect(findMatchingCodes("51")).toEqual(["PE"]);
  expect(findMatchingCodes("+51")).toEqual(["PE"]);
  expect(findMatchingCodes("51")).not.toContain("PT");
});

test("+1 returns every country of the North American plan, each one with its ISO code", () => {
  const matches = findMatchingCountries("+1");
  expect(matches).toHaveLength(26);
  expect(matches.every((country) => country.dialCode === "+1")).toBe(true);
  expect(new Set(matches.map((country) => country.code)).size).toBe(matches.length);
  expect(matches.map((country) => country.code)).toEqual(expect.arrayContaining(["US", "CA"]));
});

test("a dial code query needs a digit and skips the countries without dial code", () => {
  expect(findMatchingCodes("+")).toEqual([]);
  const digitMatches = new Set<string>("123456789".split("").flatMap(findMatchingCodes));
  expect(digitMatches.size).toBe(countries.length - 3);
  expect(["BV", "HM", "TF"].filter((code) => digitMatches.has(code))).toEqual([]);
});

test("matchesCountryQuery applies the same rules to a single country", () => {
  const matchesPeru = (query: string) => matchesCountryQuery(PERU, query);
  expect([" PERÚ ", "pe", "+51", "5"].map(matchesPeru)).toEqual([true, true, true, true]);
  expect(["pt", "351", "chile"].map(matchesPeru)).toEqual([false, false, false]);
});

test("the list is localized and kept per locale", () => {
  expect(buildCountryList("en").find((country) => country.code === "PE")?.name).toBe("Peru");
  expect(findCountry("PE")?.name).toBe("Perú");
  expect(buildCountryList("es")).toBe(countries);
});

test("the default flag comes from flagcdn at 1x and 2x", () => {
  expect(resolveFlagcdnUrl("PE", 20)).toBe("https://flagcdn.com/w20/pe.png");
  const { container } = render(createElement(CountryFlag, { code: "PE" }));
  const flag = container.querySelector("img.gdy-country-flag");
  expect(flag).toHaveAttribute("src", "https://flagcdn.com/w20/pe.png");
  expect(flag).toHaveAttribute("srcset", "https://flagcdn.com/w40/pe.png 2x");
  expect(flag).toHaveAttribute("alt", "");
  expect(flag).toHaveAttribute("loading", "lazy");
});

test("a custom resolver replaces the flag URL and a label names the flag", () => {
  const settings = { ...DEFAULT_COUNTRY_FLAG_SETTINGS, resolveUrl: resolveTestFlagUrl };
  render(createElement(CountryFlag, { code: "CA", settings, label: "Canadá" }));
  const flag = screen.getByRole("img", { name: "Canadá" });
  expect(flag).toHaveAttribute("src", "/flags/CA-20.svg");
  expect(flag).toHaveAttribute("srcset", "/flags/CA-40.svg 2x");
});

test("a hidden flag renders nothing", () => {
  const settings = { ...DEFAULT_COUNTRY_FLAG_SETTINGS, visible: false };
  const { container } = render(createElement(CountryFlag, { code: "PE", settings }));
  expect(container).toBeEmptyDOMElement();
});

test("a country option carries the code, the name and the flag with the given settings", () => {
  const settings = { ...DEFAULT_COUNTRY_FLAG_SETTINGS, resolveUrl: resolveTestFlagUrl };
  const option = toCountryOption(PERU, settings);
  expect([option.value, option.label, option.trailing]).toEqual(["PE", "Perú", undefined]);
  const { container } = render(option.leading);
  expect(container.querySelector("img.gdy-country-flag")).toHaveAttribute("src", "/flags/PE-20.svg");
});

test("a dial code option adds the dial code after the name", () => {
  const option = toDialCodeOption(PERU);
  expect([option.value, option.label, option.trailing]).toEqual(["PE", "Perú", "+51"]);
});

test("the dial code options leave out the countries without dial code", () => {
  const optionValues = buildDialCodeOptions(countries).map((option) => option.value);
  expect(optionValues).toHaveLength(countries.length - 3);
  expect(["BV", "HM", "TF"].filter((code) => optionValues.includes(code))).toEqual([]);
});

test("matchesCountryOption applies the country search rules to a list option", () => {
  const peruOption = toCountryOption(PERU);
  const matchesPeru = (query: string) => matchesCountryOption(peruOption, query);
  expect(["peru", "pe", "51"].map(matchesPeru)).toEqual([true, true, true]);
  expect(matchesCountryOption({ value: "CA", label: "Canadá" }, "+1")).toBe(true);
  expect(matchesCountryOption({ value: "PT", label: "Portugal" }, "51")).toBe(false);
  expect(matchesCountryOption({ value: "XK", label: "Kosovo" }, "kosovo")).toBe(false);
});
