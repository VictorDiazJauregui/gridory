import { useState } from "react";
import { isCountryCode } from "../../shared/countries/country-codes";
import type {
  CountryCode,
  MultipleCountrySelectProps,
  NotApplicableCountrySelectProps,
  SingleCountrySelectProps,
} from "../types";
import { resolveNotApplicableValue } from "./not-applicable-option";

type SelectionKeys = "multiple" | "notApplicableOption" | "notApplicableValue" | "value" | "defaultValue" | "onValueChange";

export type CountrySelectionProps =
  | Pick<SingleCountrySelectProps, SelectionKeys>
  | Pick<NotApplicableCountrySelectProps<string>, SelectionKeys>
  | Pick<MultipleCountrySelectProps, SelectionKeys>;

// Both modes keep a list of answers inside: the single mode holds at most one, a code or the not applicable
// value, so choosing, clearing and validating share one path.
const toAnswerList = (value: string | readonly CountryCode[] | null | undefined): string[] => {
  if (value === null || value === undefined) return [];
  if (typeof value === "string") return [value];
  return [...value];
};

const emitSelection = (props: CountrySelectionProps, answers: readonly string[]): void => {
  if (props.multiple) {
    props.onValueChange?.(answers.filter(isCountryCode));
    return;
  }
  if (props.notApplicableOption) {
    props.onValueChange?.(answers[0] ?? null);
    return;
  }
  props.onValueChange?.(answers.filter(isCountryCode)[0] ?? null);
};

const isNotApplicableChosen = (answers: readonly string[], notApplicableValue: string | null): boolean =>
  notApplicableValue !== null && answers.includes(notApplicableValue);

/** Controlled with `value`, uncontrolled from `defaultValue` otherwise. Never mutates the value it gets. */
export const useCountrySelection = (props: CountrySelectionProps) => {
  const [uncontrolledAnswers, setUncontrolledAnswers] = useState(() => toAnswerList(props.defaultValue));
  const isControlled = props.value !== undefined;
  const answers = isControlled ? toAnswerList(props.value) : uncontrolledAnswers;
  const notApplicableValue = resolveNotApplicableValue(props);
  const commitSelection = (nextAnswers: string[]) => {
    if (!isControlled) setUncontrolledAnswers(nextAnswers);
    emitSelection(props, nextAnswers);
  };
  return {
    answers,
    selectedCodes: answers.filter(isCountryCode),
    notApplicableValue,
    notApplicableChosen: isNotApplicableChosen(answers, notApplicableValue),
    commitSelection,
  };
};

export type CountrySelection = ReturnType<typeof useCountrySelection>;
