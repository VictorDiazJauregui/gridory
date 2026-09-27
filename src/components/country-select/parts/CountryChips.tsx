import { useRef } from "react";
import { cn } from "../../../lib/cn";
import type { CountryCode } from "../../shared/countries/country-codes";
import type { CountryFlagSettings } from "../../shared/countries/country-flag-url";
import type { Country } from "../../shared/countries/country-list";
import { fillTextTemplate } from "../model/fill-text-template";
import { useVisibleChipCount } from "../model/use-visible-chip-count";
import type { CountrySelectClassNames, CountrySelectTexts } from "../types";
import { CountryChip } from "./CountryChip";

interface CountryChipsProps {
  countries: readonly Country[];
  flagSettings: CountryFlagSettings;
  texts: Pick<CountrySelectTexts, "removeCountry" | "moreCountries">;
  onRemove: (code: CountryCode, removeButton: HTMLElement) => void;
  classNames?: Pick<CountrySelectClassNames, "chips" | "chip">;
}

interface MoreCountriesBadgeProps {
  hiddenCount: number;
  labelTemplate: string;
}

// Always rendered, hidden while every chip fits, so its width can be measured before it is needed.
const MoreCountriesBadge = ({ hiddenCount, labelTemplate }: MoreCountriesBadgeProps) => (
  <li
    data-more-badge
    hidden={hiddenCount === 0}
    className="gdy-country-select-more"
    aria-label={fillTextTemplate(labelTemplate, { count: hiddenCount })}
  >
    {`+${hiddenCount}`}
  </li>
);

export const CountryChips = ({ countries, flagSettings, texts, onRemove, classNames }: CountryChipsProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const visibleCount = useVisibleChipCount(listRef, countries.map((country) => country.code));
  return (
    <ul ref={listRef} className={cn("gdy-country-select-chips", classNames?.chips)}>
      {countries.map((country, index) => (
        <CountryChip
          key={country.code}
          country={country}
          flagSettings={flagSettings}
          removeLabel={fillTextTemplate(texts.removeCountry, { country: country.name })}
          hidden={index >= visibleCount}
          onRemove={onRemove}
          className={classNames?.chip}
        />
      ))}
      <MoreCountriesBadge hiddenCount={countries.length - visibleCount} labelTemplate={texts.moreCountries} />
    </ul>
  );
};
