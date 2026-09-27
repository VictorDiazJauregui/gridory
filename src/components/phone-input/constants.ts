import type { PhoneInputTexts, PhoneInputValue } from "./types";

export const DEFAULT_PHONE_INPUT_LABEL = "Teléfono";

export const DEFAULT_PHONE_INPUT_TEXTS: PhoneInputTexts = {
  countryPlaceholder: "País",
  prefixButton: "Prefijo: {country}",
  prefixList: "Prefijos por país",
  searchLabel: "Buscar prefijo",
  searchPlaceholder: "Buscar país o prefijo...",
  noResults: "No se encontró el país",
};

export const PHONE_INPUT_DEFAULTS = {
  required: false,
  locale: "es",
  showFlags: true,
  thinScrollbars: true,
} as const;

export const EMPTY_PHONE_VALUE: PhoneInputValue = { country: null, number: "" };
