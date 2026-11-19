import { applyPropDefaults } from "../../shared/prop-defaults";
import { DEFAULT_COUNTRY_SELECT_TEXTS } from "../constants";
import type { CountrySelectTexts } from "../types";

export const resolveCountrySelectTexts = (texts: Partial<CountrySelectTexts> = {}): Required<CountrySelectTexts> =>
  applyPropDefaults(DEFAULT_COUNTRY_SELECT_TEXTS, texts);
