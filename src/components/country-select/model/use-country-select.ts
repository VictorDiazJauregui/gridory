import { isCountryCode } from "../../shared/countries/country-codes";
import type { CountryCode, CountrySelectProps, CountrySelectTexts } from "../types";
import { focusBoxCombobox } from "./combobox-focus";
import { applyCountrySelectDefaults, type ResolvedCountrySelectProps } from "./country-select-props";
import { resolveCountrySelectTexts } from "./country-select-texts";
import { resolveDisplayedError, resolveOwnSelectionError } from "./selection-error";
import { resolveSelectionRange } from "./selection-mode";
import { toggleCountry, type SelectionRange } from "./selection-range";
import { findCountries, useCountryCatalog } from "./use-country-catalog";
import { useCountryPanel, type CountryPanel } from "./use-country-panel";
import { useCountrySelection, type CountrySelection } from "./use-country-selection";
import { useSelectionLimit } from "./use-selection-limit";

interface SelectionActionsInput {
  selection: CountrySelection;
  panel: CountryPanel;
  range: SelectionRange;
}

type CountryPicker = (code: CountryCode) => void;

// Closing hands the focus back to the combobox (Radix does it), and choosing
// the country already chosen only closes: the app hears about real changes only.
const buildSinglePicker = ({ selection, panel }: SelectionActionsInput): CountryPicker => (code) => {
  panel.changeOpen(false);
  if (selection.selectedCodes.includes(code)) return;
  selection.commitSelection([code]);
};

// The list stays open, so several countries are picked in a row, in the order chosen.
const buildMultiplePicker = ({ selection, range }: SelectionActionsInput): CountryPicker => (code) =>
  selection.commitSelection(toggleCountry(selection.selectedCodes, code, range));

// The clear and remove buttons disappear with what they remove, so the focus
// moves to the combobox instead of the page.
const buildSelectionActions = (input: SelectionActionsInput, pickCode: CountryPicker) => ({
  pickCountry: (value: string) => {
    if (isCountryCode(value)) pickCode(value);
  },
  clearSelection: (clearButton: HTMLElement) => {
    focusBoxCombobox(clearButton);
    input.selection.commitSelection([]);
  },
  removeCountry: (code: CountryCode, removeButton: HTMLElement) => {
    focusBoxCombobox(removeButton);
    input.panel.markTouched();
    input.selection.commitSelection(toggleCountry(input.selection.selectedCodes, code, input.range));
  },
});

const useSelectionState = (props: ResolvedCountrySelectProps, texts: CountrySelectTexts) => {
  const range = resolveSelectionRange(props);
  const input = { selection: useCountrySelection(props), panel: useCountryPanel(), range };
  const pickCode = props.multiple ? buildMultiplePicker(input) : buildSinglePicker(input);
  const ownError = resolveOwnSelectionError({
    touched: input.panel.touched,
    required: props.required,
    selectedCount: input.selection.selectedCodes.length,
    range,
    texts,
  });
  return { ...input, ...buildSelectionActions(input, pickCode), error: resolveDisplayedError(props.error, ownError) };
};

export const useCountrySelect = (props: CountrySelectProps) => {
  const resolvedProps = applyCountrySelectDefaults(props);
  const texts = resolveCountrySelectTexts(props.texts);
  const { selection, range, ...state } = useSelectionState(resolvedProps, texts);
  const catalog = useCountryCatalog(resolvedProps);
  const multiple = Boolean(props.multiple);
  const { selectedCodes } = selection;
  const limit = useSelectionLimit({ multiple, range, selectedCodes, options: catalog.options, texts });
  return {
    ...state,
    ...catalog,
    ...limit,
    resolvedProps,
    texts,
    multiple,
    selectedCodes,
    selectedCountries: findCountries(catalog.countries, selectedCodes),
  };
};

export type CountrySelectView = ReturnType<typeof useCountrySelect>;
