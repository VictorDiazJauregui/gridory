import type { ListboxOption } from "./listbox-props";

const NO_ACTIVE_INDEX = -1;

type ActiveIndexStep = 1 | -1;

const isEnabledOption = (option: ListboxOption) => !option.disabled;

export const findFirstEnabledIndex = (options: ListboxOption[]): number =>
  options.findIndex(isEnabledOption);

export const findLastEnabledIndex = (options: ListboxOption[]): number =>
  options.findLastIndex(isEnabledOption);

export const findInitialActiveIndex = (
  options: ListboxOption[],
  selectedValues: string[],
): number => {
  const selectedIndex = options.findIndex(
    (option) => isEnabledOption(option) && selectedValues.includes(option.value),
  );
  return selectedIndex === NO_ACTIVE_INDEX ? findFirstEnabledIndex(options) : selectedIndex;
};

export const resolveActiveIndex = (
  options: ListboxOption[],
  activeValue: string | null,
): number => {
  const activeIndex = options.findIndex((option) => option.value === activeValue);
  return activeIndex === NO_ACTIVE_INDEX ? findFirstEnabledIndex(options) : activeIndex;
};

export const moveActiveIndex = (
  options: ListboxOption[],
  activeIndex: number,
  step: ActiveIndexStep,
): number => {
  for (let index = activeIndex + step; index >= 0 && index < options.length; index += step) {
    if (isEnabledOption(options[index])) return index;
  }
  return activeIndex;
};
