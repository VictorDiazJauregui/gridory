import type { ReactNode } from "react";
import type { AccessibleName } from "../accessible-name";
import { applyPropDefaults } from "../prop-defaults";

export interface ListboxOption {
  value: string;
  label: string;
  searchTerms?: string[];
  leading?: ReactNode;
  trailing?: ReactNode;
  disabled?: boolean;
}

export interface ListboxTexts {
  searchLabel: string;
  searchPlaceholder: string;
  noResults: string;
}

export type ListboxQueryMatcher = (option: ListboxOption, query: string) => boolean;

export type ListboxProps = AccessibleName & {
  options: ListboxOption[];
  selectedValues: string[];
  /** The list keeps no selection: the consumer decides what a pick means (in multiple, a toggle). */
  onSelect: (value: string) => void;
  multiple?: boolean;
  texts?: Partial<ListboxTexts>;
  thinScrollbars?: boolean;
  scrollbarColor?: string;
  matchesQuery?: ListboxQueryMatcher;
};

const DEFAULT_LISTBOX_TEXTS: ListboxTexts = {
  searchLabel: "Buscar",
  searchPlaceholder: "Buscar...",
  noResults: "Sin resultados",
};

const LISTBOX_DEFAULTS = { multiple: false, thinScrollbars: true };

export const applyListboxDefaults = (props: ListboxProps) =>
  applyPropDefaults(LISTBOX_DEFAULTS, props);

export type ResolvedListboxProps = ReturnType<typeof applyListboxDefaults>;

export const resolveListboxTexts = (texts: Partial<ListboxTexts> = {}): ListboxTexts =>
  applyPropDefaults(DEFAULT_LISTBOX_TEXTS, texts);
