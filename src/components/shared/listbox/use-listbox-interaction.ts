import { useId, useMemo, useState, type KeyboardEvent } from "react";
import {
  findFirstEnabledIndex,
  findInitialActiveIndex,
  findLastEnabledIndex,
  moveActiveIndex,
  resolveActiveIndex,
} from "./active-index";
import { filterListboxOptions } from "./listbox-filter";
import type { ListboxOption, ListboxProps } from "./listbox-props";

type ActiveIndexResolver = (options: ListboxOption[], activeIndex: number) => number;

const ACTIVE_INDEX_RESOLVERS = new Map<string, ActiveIndexResolver>([
  ["ArrowDown", (options, activeIndex) => moveActiveIndex(options, activeIndex, 1)],
  ["ArrowUp", (options, activeIndex) => moveActiveIndex(options, activeIndex, -1)],
  ["Home", findFirstEnabledIndex],
  ["End", findLastEnabledIndex],
]);

interface SelectionHandlersInput {
  visibleOptions: ListboxOption[];
  activeIndex: number;
  activateValue: (value: string | null) => void;
  onSelect: (value: string) => void;
}

type OptionSelector = (option: ListboxOption) => void;

const readOptionValue = (options: ListboxOption[], index: number): string | null =>
  options[index]?.value ?? null;

const useActiveOption = ({ options, selectedValues }: ListboxProps) => {
  const [activeValue, setActiveValue] = useState(() =>
    readOptionValue(options, findInitialActiveIndex(options, selectedValues)),
  );
  // A row under the pointer is already in view: scrolling it would slide the
  // list beneath the pointer, so only keyboard and search moves scroll.
  const [scrollsToActiveOption, setScrollsToActiveOption] = useState(true);
  const activateValue = (value: string | null) => {
    setActiveValue(value);
    setScrollsToActiveOption(true);
  };
  const activateOptionUnderPointer = (option: ListboxOption) => {
    if (option.disabled) return;
    setActiveValue(option.value);
    setScrollsToActiveOption(false);
  };
  return { activeValue, scrollsToActiveOption, activateValue, activateOptionUnderPointer };
};

const useQueryAndActiveOption = (props: ListboxProps) => {
  const [query, setQuery] = useState("");
  const activeOption = useActiveOption(props);
  const changeQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    activeOption.activateValue(null);
  };
  return { ...activeOption, query, changeQuery };
};

const useVisibleOptions = ({ options, matchesQuery }: ListboxProps, query: string) =>
  useMemo(
    () => filterListboxOptions(options, query, matchesQuery),
    [options, query, matchesQuery],
  );

const useOptionIds = (options: ListboxOption[], activeOption: ListboxOption | undefined) => {
  const baseId = useId();
  const indexByValue = useMemo(
    () => new Map(options.map((option, index) => [option.value, index])),
    [options],
  );
  const resolveOptionId = (option: ListboxOption) =>
    `${baseId}-option-${indexByValue.get(option.value)}`;
  return {
    listId: `${baseId}-listbox`,
    resolveOptionId,
    activeOptionId: activeOption && resolveOptionId(activeOption),
  };
};

const createSearchKeyDownHandler =
  (input: SelectionHandlersInput, selectOption: OptionSelector) =>
  (event: KeyboardEvent<HTMLInputElement>) => {
    const resolveTargetIndex = ACTIVE_INDEX_RESOLVERS.get(event.key);
    if (resolveTargetIndex) {
      event.preventDefault();
      const targetIndex = resolveTargetIndex(input.visibleOptions, input.activeIndex);
      input.activateValue(readOptionValue(input.visibleOptions, targetIndex));
      return;
    }
    if (event.key !== "Enter") return;
    event.preventDefault();
    const activeOption = input.visibleOptions[input.activeIndex];
    if (activeOption) selectOption(activeOption);
  };

const buildSelectionHandlers = (input: SelectionHandlersInput) => {
  const selectOption: OptionSelector = (option) => {
    if (option.disabled) return;
    input.activateValue(option.value);
    input.onSelect(option.value);
  };
  return { selectOption, handleSearchKeyDown: createSearchKeyDownHandler(input, selectOption) };
};

export const useListboxInteraction = (props: ListboxProps) => {
  const { activeValue, activateValue, ...queryAndPointer } = useQueryAndActiveOption(props);
  const visibleOptions = useVisibleOptions(props, queryAndPointer.query);
  const activeIndex = resolveActiveIndex(visibleOptions, activeValue);
  const optionIds = useOptionIds(props.options, visibleOptions[activeIndex]);
  const handlers = buildSelectionHandlers({
    visibleOptions,
    activeIndex,
    activateValue,
    onSelect: props.onSelect,
  });
  return { ...optionIds, ...handlers, ...queryAndPointer, visibleOptions };
};

export type ListboxInteraction = ReturnType<typeof useListboxInteraction>;
