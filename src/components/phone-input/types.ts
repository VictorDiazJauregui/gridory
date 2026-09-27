import type { ReactNode } from "react";
import type { CountryCode } from "../shared/countries/country-codes";
import type { FlagUrlResolver } from "../shared/countries/country-flag-url";
import type { FieldLabelPosition } from "../shared/field/field-props";

export type { CountryCode, FlagUrlResolver };

/** The country is kept by its ISO code: Canada and the United States share +1 but stay apart. */
export interface PhoneInputValue {
  country: CountryCode | null;
  number: string;
}

/** Every text the control shows or announces. `{…}` marks are filled in at runtime. */
export interface PhoneInputTexts {
  /** Shown in the prefix while no country is chosen. */
  countryPlaceholder: string;
  /** Accessible name of the prefix button. Mark: `{country}`, the chosen country or the placeholder. */
  prefixButton: string;
  /** Accessible name of the list of dial codes. */
  prefixList: string;
  searchLabel: string;
  searchPlaceholder: string;
  noResults: string;
}

/** One class per part, added next to the `gdy-phone-input-*` hooks. */
export interface PhoneInputClassNames {
  root?: string;
  prefix?: string;
  number?: string;
  panel?: string;
}

/** "Teléfono" by default; replace it with `label` or name the number with `aria-label` / `aria-labelledby`. */
export type PhoneInputNaming =
  | { label?: ReactNode; "aria-label"?: never; "aria-labelledby"?: never }
  | { label?: never; "aria-label": string; "aria-labelledby"?: never }
  | { label?: never; "aria-label"?: never; "aria-labelledby": string };

/** What the prefix and the number need, with or without the label and error around them. */
export interface PhoneInputSettings {
  /** Controlled value. Leave it out and use `defaultValue` for an uncontrolled control. */
  value?: PhoneInputValue;
  defaultValue?: PhoneInputValue;
  /** Country of an uncontrolled control that starts without `defaultValue`. No country by default. */
  defaultCountry?: CountryCode;
  /** Fires with a new object when the country or the number change. */
  onValueChange?: (value: PhoneInputValue) => void;
  placeholder?: string;
  /** A number is taken as px; a string as any CSS length. Defaults to `--gdy-phone-input-width`. */
  width?: number | string;
  /** Language of the country names. */
  locale?: string;
  showFlags?: boolean;
  /** Builds the flag image URL. flagcdn.com by default. */
  flagUrl?: FlagUrlResolver;
  thinScrollbars?: boolean;
  scrollbarColor?: string;
  texts?: Partial<PhoneInputTexts>;
  className?: string;
  classNames?: PhoneInputClassNames;
}

export type PhoneInputProps = PhoneInputNaming &
  PhoneInputSettings & {
    labelPosition?: FieldLabelPosition;
    /** Marks the field as required. The control never shows an error of its own: pass `error`. */
    required?: boolean;
    /** Error from the app, shown below the field. */
    error?: ReactNode;
  };
