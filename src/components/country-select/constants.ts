import type { CountrySelectTexts } from "./types";

export const DEFAULT_COUNTRY_SELECT_LABEL = "País";

// Required: a key added in a minor version is optional in CountrySelectTexts, so full texts objects still compile.
export const DEFAULT_COUNTRY_SELECT_TEXTS: Required<CountrySelectTexts> = {
  placeholder: "Selecciona un país",
  multiplePlaceholder: "Selecciona países",
  searchLabel: "Buscar país",
  searchPlaceholder: "Buscar país...",
  noResults: "No se encontró el país",
  clearSelection: "Quitar selección",
  removeCountry: "Quitar {country}",
  moreCountries: "{count} más",
  selectedCountries: "Países seleccionados: {count}",
  maxReached: "Alcanzaste el máximo permitido ({max})",
  belowMinimum: "Selecciona al menos {min} países",
  required: "Selecciona un país",
  notApplicable: "No aplica",
};

export const COUNTRY_SELECT_DEFAULTS = {
  required: false,
  locale: "es",
  showFlags: true,
  thinScrollbars: true,
  minSelected: 1,
  disabled: false,
} as const;
