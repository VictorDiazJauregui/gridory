import { isCountryCode } from "../../shared/countries/country-codes";
import type { ListboxOption } from "../../shared/listbox/listbox-props";
import type { CountryCode, CountrySelectProps, CountrySelectTexts } from "../types";
import { focusBoxCombobox } from "./combobox-focus";
import { applyCountrySelectDefaults, type ResolvedCountrySelectProps } from "./country-select-props";
import { resolveCountrySelectTexts } from "./country-select-texts";
import { NOT_APPLICABLE_OPTION_VALUE, useOptionsWithNotApplicable } from "./not-applicable-option";
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

/** An answer is a country code or the not applicable value. */
type AnswerPicker = (answer: string) => void;

// Closing hands the focus back to the combobox (Radix does it), and choosing
// the answer already chosen only closes: the app hears about real changes only.
const buildSinglePicker = ({ selection, panel }: SelectionActionsInput): AnswerPicker => (answer) => {
  panel.changeOpen(false);
  if (selection.answers.includes(answer)) return;
  selection.commitSelection([answer]);
};

// The list stays open, so several countries are picked in a row, in the order chosen.
const buildMultiplePicker = ({ selection, range }: SelectionActionsInput): AnswerPicker => (answer) => {
  if (isCountryCode(answer)) selection.commitSelection(toggleCountry(selection.selectedCodes, answer, range));
};

const resolvePickedAnswer = (optionValue: string, notApplicableValue: string | null): string | null => {
  if (optionValue === NOT_APPLICABLE_OPTION_VALUE) return notApplicableValue;
  return isCountryCode(optionValue) ? optionValue : null;
};

// The clear and remove buttons disappear with what they remove, so the focus
// moves to the combobox instead of the page.
const buildSelectionActions = (input: SelectionActionsInput, pickAnswer: AnswerPicker) => ({
  pickCountry: (optionValue: string) => {
    const answer = resolvePickedAnswer(optionValue, input.selection.notApplicableValue);
    if (answer !== null) pickAnswer(answer);
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

// A disabled control cannot be touched, so it shows no error of its own.
const useSelectionState = (props: ResolvedCountrySelectProps, texts: CountrySelectTexts) => {
  const range = resolveSelectionRange(props);
  const input = { selection: useCountrySelection(props), panel: useCountryPanel(props.disabled), range };
  const pickAnswer = props.multiple ? buildMultiplePicker(input) : buildSinglePicker(input);
  const ownError = resolveOwnSelectionError({
    touched: input.panel.touched && !props.disabled,
    required: props.required,
    selectedCount: input.selection.answers.length,
    range,
    texts,
  });
  return { ...input, ...buildSelectionActions(input, pickAnswer), error: resolveDisplayedError(props.error, ownError) };
};

interface ListOptionsInput {
  countryOptions: ListboxOption[];
  selection: CountrySelection;
  range: SelectionRange;
  texts: Required<CountrySelectTexts>;
  multiple: boolean;
}

const useListOptions = ({ countryOptions, selection, range, texts, multiple }: ListOptionsInput) => {
  const notApplicableLabel = selection.notApplicableValue === null ? null : texts.notApplicable;
  const options = useOptionsWithNotApplicable(countryOptions, notApplicableLabel);
  return useSelectionLimit({ multiple, range, selectedCodes: selection.selectedCodes, options, texts });
};

export const useCountrySelect = (props: CountrySelectProps<string>) => {
  const resolvedProps = applyCountrySelectDefaults(props);
  const texts = resolveCountrySelectTexts(props.texts);
  const { selection, range, ...state } = useSelectionState(resolvedProps, texts);
  const catalog = useCountryCatalog(resolvedProps);
  const multiple = Boolean(props.multiple);
  const limit = useListOptions({ countryOptions: catalog.options, selection, range, texts, multiple });
  const { selectedCodes, notApplicableChosen } = selection;
  return {
    ...state, ...catalog, ...limit, resolvedProps, texts, multiple, selectedCodes, notApplicableChosen,
    selectedCountries: findCountries(catalog.countries, selectedCodes),
  };
};

export type CountrySelectView = ReturnType<typeof useCountrySelect>;
