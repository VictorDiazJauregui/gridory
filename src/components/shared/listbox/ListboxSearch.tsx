import { useEffect, useRef } from "react";
import type { ListboxTexts } from "./listbox-props";
import type { ListboxInteraction } from "./use-listbox-interaction";

interface ListboxSearchProps {
  interaction: ListboxInteraction;
  texts: ListboxTexts;
}

const useFocusOnMount = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);
  return inputRef;
};

const buildComboboxAttributes = (interaction: ListboxInteraction) =>
  ({
    role: "combobox",
    "aria-expanded": true,
    "aria-controls": interaction.listId,
    "aria-autocomplete": "list",
    "aria-activedescendant": interaction.activeOptionId,
  }) as const;

export const ListboxSearch = ({ interaction, texts }: ListboxSearchProps) => {
  const inputRef = useFocusOnMount();
  return (
    <input
      ref={inputRef}
      type="text"
      className="gdy-listbox-search"
      {...buildComboboxAttributes(interaction)}
      aria-label={texts.searchLabel}
      placeholder={texts.searchPlaceholder}
      autoComplete="off"
      value={interaction.query}
      onChange={(event) => interaction.changeQuery(event.target.value)}
      onKeyDown={interaction.handleSearchKeyDown}
    />
  );
};
