import {
  includesNormalizedQuery,
  normalizeSearchText,
} from "../text-search/normalize-search-text";
import type { ListboxOption, ListboxQueryMatcher } from "./listbox-props";

const matchesLabelOrSearchTerms: ListboxQueryMatcher = (option, query) => {
  const normalizedQuery = normalizeSearchText(query);
  return [option.label, ...(option.searchTerms ?? [])].some((text) =>
    includesNormalizedQuery(text, normalizedQuery),
  );
};

export const filterListboxOptions = (
  options: ListboxOption[],
  query: string,
  matchesQuery: ListboxQueryMatcher = matchesLabelOrSearchTerms,
): ListboxOption[] => {
  if (normalizeSearchText(query) === "") return options;
  return options.filter((option) => matchesQuery(option, query));
};
