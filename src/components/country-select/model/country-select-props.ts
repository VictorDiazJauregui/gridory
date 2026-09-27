import { applyPropDefaults } from "../../shared/prop-defaults";
import { COUNTRY_SELECT_DEFAULTS } from "../constants";
import type { CountrySelectProps } from "../types";

export interface CountrySelectResolvedDefaults {
  required: boolean;
  locale: string;
  showFlags: boolean;
  thinScrollbars: boolean;
}

// Typed wider than the literal constants, so a resolved `required` reads as a
// boolean and not as the `false` of the default.
export const applyCountrySelectDefaults = (props: CountrySelectProps) =>
  applyPropDefaults<CountrySelectProps, CountrySelectResolvedDefaults>(COUNTRY_SELECT_DEFAULTS, props);

export type ResolvedCountrySelectProps = ReturnType<typeof applyCountrySelectDefaults>;
