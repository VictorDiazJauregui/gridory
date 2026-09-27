import { useMemo } from "react";
import { buildCountryList } from "../../shared/countries/country-list";
import { buildDialCodeOptions } from "../../shared/countries/country-listbox-options";
import { resolveFlagcdnUrl, type CountryFlagSettings } from "../../shared/countries/country-flag-url";
import type { CountryCode, FlagUrlResolver } from "../types";

interface DialCodeCatalogSettings {
  locale: string;
  showFlags: boolean;
  flagUrl?: FlagUrlResolver;
}

// Memoized so the list keeps the same options between renders: the listbox
// filters them again whenever the array changes.
const useFlagSettings = ({ showFlags, flagUrl }: DialCodeCatalogSettings) =>
  useMemo<CountryFlagSettings>(
    () => ({ visible: showFlags, resolveUrl: flagUrl ?? resolveFlagcdnUrl }),
    [showFlags, flagUrl],
  );

/** The localized countries that have a dial code, as list options, and the flag settings they use. */
export const useDialCodeCatalog = (settings: DialCodeCatalogSettings) => {
  const countries = buildCountryList(settings.locale);
  const flagSettings = useFlagSettings(settings);
  const options = useMemo(() => buildDialCodeOptions(countries, flagSettings), [countries, flagSettings]);
  const findCountry = (code: CountryCode | null) => countries.find((country) => country.code === code);
  return { flagSettings, options, findCountry };
};
