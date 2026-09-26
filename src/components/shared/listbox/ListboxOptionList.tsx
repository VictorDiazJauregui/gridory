import type { RefObject } from "react";
import { cn } from "../../../lib/cn";
import { ListboxOptionRow } from "./ListboxOptionRow";
import type { ResolvedListboxProps } from "./listbox-props";
import type { ListboxInteraction } from "./use-listbox-interaction";

interface ListboxOptionListProps {
  interaction: ListboxInteraction;
  resolvedProps: ResolvedListboxProps;
  listRef: RefObject<HTMLUListElement | null>;
}

export const ListboxOptionList = ({ interaction, resolvedProps, listRef }: ListboxOptionListProps) => (
  <ul
    ref={listRef}
    id={interaction.listId}
    role="listbox"
    className={cn("gdy-listbox-options", resolvedProps.thinScrollbars && "gdy-scroll")}
    aria-label={resolvedProps["aria-label"]}
    aria-labelledby={resolvedProps["aria-labelledby"]}
    aria-multiselectable={resolvedProps.multiple || undefined}
  >
    {interaction.visibleOptions.map((option) => (
      <ListboxOptionRow
        key={option.value}
        option={option}
        interaction={interaction}
        isSelected={resolvedProps.selectedValues.includes(option.value)}
      />
    ))}
  </ul>
);
