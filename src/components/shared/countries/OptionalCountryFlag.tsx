import type { CountryCode } from "./country-codes";
import { DEFAULT_COUNTRY_FLAG_SETTINGS, type CountryFlagSettings } from "./country-flag-url";
import { CountryFlag } from "./CountryFlag";

interface OptionalCountryFlagProps {
  code: CountryCode;
  settings?: CountryFlagSettings;
  label?: string;
}

// The selectors' showFlags hides it; the element stays, so a listbox row keeps its leading slot as in 2.2.0.
export const OptionalCountryFlag = ({ code, settings = DEFAULT_COUNTRY_FLAG_SETTINGS, label }: OptionalCountryFlagProps) => {
  if (!settings.visible) return null;
  return <CountryFlag code={code} label={label} flagUrl={settings.resolveUrl} />;
};
