import { useState } from "react";
import type { CountryCode, MultipleCountrySelectProps, SingleCountrySelectProps } from "../types";

type SelectionKeys = "multiple" | "value" | "defaultValue" | "onValueChange";

export type CountrySelectionProps =
  | Pick<SingleCountrySelectProps, SelectionKeys>
  | Pick<MultipleCountrySelectProps, SelectionKeys>;

// Both modes keep an array inside: the single mode is a selection of at most
// one code, so choosing, clearing and validating share one path.
const toCodeList = (value: CountryCode | CountryCode[] | null): CountryCode[] => {
  if (value === null) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

const emitSelection = (props: CountrySelectionProps, codes: CountryCode[]): void => {
  if (props.multiple) {
    props.onValueChange?.(codes);
    return;
  }
  props.onValueChange?.(codes[0] ?? null);
};

/** Controlled with `value`, uncontrolled from `defaultValue` otherwise. Never mutates the value it gets. */
export const useCountrySelection = (props: CountrySelectionProps) => {
  const [uncontrolledCodes, setUncontrolledCodes] = useState(() => toCodeList(props.defaultValue ?? null));
  const isControlled = props.value !== undefined;
  const selectedCodes = isControlled ? toCodeList(props.value ?? null) : uncontrolledCodes;
  const commitSelection = (nextCodes: CountryCode[]) => {
    if (!isControlled) setUncontrolledCodes(nextCodes);
    emitSelection(props, nextCodes);
  };
  return { selectedCodes, commitSelection };
};

export type CountrySelection = ReturnType<typeof useCountrySelection>;
