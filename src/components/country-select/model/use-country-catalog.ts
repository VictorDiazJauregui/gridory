import { useMemo } from "react";
import { buildCountryList, type Country } from "../../shared/countries/country-list";
import { toCountryOption } from "../../shared/countries/country-listbox-options";
import { resolveFlagcdnUrl, type CountryFlagSettings } from "../../shared/countries/country-flag-url";
import type { CountryCode, FlagUrlResolver } from "../types";

interface CountryCatalogSettings {
  locale: string;
  showFlags: boolean;
  flagUrl?: FlagUrlResolver;
}

// Memoized so the list keeps the same options between renders: the listbox
// filters them again whenever the array changes.
const useFlagSettings = ({ showFlags, flagUrl }: CountryCatalogSettings) =>
  useMemo<CountryFlagSettings>(
    () => ({ visible: showFlags, resolveUrl: flagUrl ?? resolveFlagcdnUrl }),
    [showFlags, flagUrl],
  );

/** The localized countries, their list options and the flag settings they were built with. */
export const useCountryCatalog = (settings: CountryCatalogSettings) => {
  const countries = buildCountryList(settings.locale);
  const flagSettings = useFlagSettings(settings);
  const options = useMemo(
    () => countries.map((country) => toCountryOption(country, flagSettings)),
    [countries, flagSettings],
  );
  return { countries, flagSettings, options };
};

export const findCountries = (countries: readonly Country[], codes: readonly CountryCode[]): Country[] =>
  codes.flatMap((code) => countries.find((country) => country.code === code) ?? []);
