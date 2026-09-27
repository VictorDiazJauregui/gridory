import {
  includesNormalizedQuery,
  normalizeSearchText,
} from "../text-search/normalize-search-text";
import type { Country } from "./country-list";

const DIAL_CODE_QUERY = /^[\d+\s]+$/;
const NON_DIGITS = /\D/g;

const extractDigits = (text: string): string => text.replace(NON_DIGITS, "");

// Only the start of the dial code counts, so "51" finds Peru (+51) and not Portugal (+351).
const matchesDialCodePrefix = (dialCode: string | undefined, normalizedQuery: string): boolean => {
  if (!dialCode || !DIAL_CODE_QUERY.test(normalizedQuery)) return false;
  const queryDigits = extractDigits(normalizedQuery);
  return queryDigits.length > 0 && extractDigits(dialCode).startsWith(queryDigits);
};

export const matchesCountryQuery = (country: Country, query: string): boolean => {
  const normalizedQuery = normalizeSearchText(query);
  return (
    includesNormalizedQuery(country.name, normalizedQuery) ||
    normalizedQuery === country.code.toLowerCase() ||
    matchesDialCodePrefix(country.dialCode, normalizedQuery)
  );
};
