import type { MouseEvent } from "react";
import { cn } from "../../../lib/cn";
import type { CountryCode } from "../../shared/countries/country-codes";
import type { CountryFlagSettings } from "../../shared/countries/country-flag-url";
import type { Country } from "../../shared/countries/country-list";
import { OptionalCountryFlag } from "../../shared/countries/OptionalCountryFlag";

interface CountryChipProps {
  country: Country;
  flagSettings: CountryFlagSettings;
  removeLabel: string;
  hidden: boolean;
  disabled: boolean;
  onRemove: (code: CountryCode, removeButton: HTMLElement) => void;
  className?: string;
}

export const CountryChip = ({ country, flagSettings, removeLabel, hidden, disabled, onRemove, className }: CountryChipProps) => {
  const removeCountry = (event: MouseEvent<HTMLButtonElement>) => onRemove(country.code, event.currentTarget);
  return (
    <li data-chip hidden={hidden} className={cn("gdy-country-select-chip", className)} title={country.name}>
      <OptionalCountryFlag code={country.code} settings={flagSettings} />
      <span className="gdy-country-select-chip-label">{country.name}</span>
      <button type="button" className="gdy-country-select-chip-remove" aria-label={removeLabel} disabled={disabled} onClick={removeCountry}>
        ×
      </button>
    </li>
  );
};
