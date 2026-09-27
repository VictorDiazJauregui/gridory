import type { ReactNode } from "react";
import type { CountryCode } from "../shared/countries/country-codes";
import type { FlagUrlResolver } from "../shared/countries/country-flag-url";

export type { CountryCode, FlagUrlResolver };

/** Every text the control shows or announces. `{…}` marks are filled in at runtime. */
export interface CountrySelectTexts {
  placeholder: string;
  multiplePlaceholder: string;
  searchLabel: string;
  searchPlaceholder: string;
  noResults: string;
  clearSelection: string;
  /** Name of a chip's remove button. Mark: `{country}`. */
  removeCountry: string;
  /** Accessible name of the "+N" badge. Mark: `{count}`. */
  moreCountries: string;
  /** Hidden summary the combobox reads in multiple mode. Mark: `{count}`. */
  selectedCountries: string;
  /** Shown while the maximum is reached. Mark: `{max}`. */
  maxReached: string;
  /** Error below the minimum in multiple mode. Mark: `{min}`. */
  belowMinimum: string;
  /** Error of a required control left empty. */
  required: string;
}

/** One class per part, added next to the `gdy-country-select-*` hooks. */
export interface CountrySelectClassNames {
  root?: string;
  trigger?: string;
  value?: string;
  clear?: string;
  chips?: string;
  chip?: string;
  panel?: string;
}

/** "País" by default; replace it with `label` or name the control with `aria-label` / `aria-labelledby`. */
export type CountrySelectNaming =
  | { label?: ReactNode; "aria-label"?: never; "aria-labelledby"?: never }
  | { label?: never; "aria-label": string; "aria-labelledby"?: never }
  | { label?: never; "aria-label"?: never; "aria-labelledby": string };

interface CountrySelectBaseProps {
  /** Marks the control as required: no clear button, and an empty selection is an error once the list closes. */
  required?: boolean;
  /** Error from the app. It always wins over the control's own error. */
  error?: ReactNode;
  /** A number is taken as px; a string as any CSS length. Defaults to `--gdy-country-select-width`. */
  width?: number | string;
  /** Language of the country names. */
  locale?: string;
  showFlags?: boolean;
  /** Builds the flag image URL. flagcdn.com by default. */
  flagUrl?: FlagUrlResolver;
  thinScrollbars?: boolean;
  scrollbarColor?: string;
  texts?: Partial<CountrySelectTexts>;
  className?: string;
  classNames?: CountrySelectClassNames;
}

export type SingleCountrySelectProps = CountrySelectBaseProps & {
  multiple?: false;
  /** Controlled value. Leave it out and use `defaultValue` for an uncontrolled control. */
  value?: CountryCode | null;
  defaultValue?: CountryCode | null;
  /** Fires only when the country changes; `null` when it is cleared. */
  onValueChange?: (value: CountryCode | null) => void;
};

export type MultipleCountrySelectProps = CountrySelectBaseProps & {
  multiple: true;
  /** Smallest valid selection. An empty selection is only an error when `required`. */
  minSelected?: number;
  /** Largest selection. No limit when left out. */
  maxSelected?: number;
  value?: CountryCode[];
  defaultValue?: CountryCode[];
  /** Fires with a new array, in the order the countries were picked. */
  onValueChange?: (value: CountryCode[]) => void;
};

export type CountrySelectProps = CountrySelectNaming & (SingleCountrySelectProps | MultipleCountrySelectProps);
