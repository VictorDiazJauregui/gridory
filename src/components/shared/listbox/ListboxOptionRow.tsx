import type { MouseEvent } from "react";
import { Check } from "lucide-react";
import type { ListboxOption } from "./listbox-props";
import type { ListboxInteraction } from "./use-listbox-interaction";

interface ListboxOptionRowProps {
  option: ListboxOption;
  interaction: ListboxInteraction;
  isSelected: boolean;
}

interface ListboxOptionContentProps {
  option: ListboxOption;
  isSelected: boolean;
}

const keepSearchFocus = (event: MouseEvent<HTMLLIElement>) => event.preventDefault();

const ListboxOptionContent = ({ option, isSelected }: ListboxOptionContentProps) => (
  <>
    <span className="gdy-listbox-check">{isSelected ? <Check size={14} /> : null}</span>
    {option.leading ? <span className="gdy-listbox-leading">{option.leading}</span> : null}
    <span className="gdy-listbox-label" title={option.label}>
      {option.label}
    </span>
    {option.trailing ? <span className="gdy-listbox-trailing">{option.trailing}</span> : null}
  </>
);

export const ListboxOptionRow = ({ option, interaction, isSelected }: ListboxOptionRowProps) => {
  const id = interaction.resolveOptionId(option);
  return (
    <li
      id={id}
      role="option"
      className="gdy-listbox-option"
      aria-selected={isSelected}
      aria-disabled={option.disabled || undefined}
      data-active={id === interaction.activeOptionId || undefined}
      onMouseDown={keepSearchFocus}
      onMouseMove={() => interaction.activateOptionUnderPointer(option)}
      onClick={() => interaction.selectOption(option)}
    >
      <ListboxOptionContent option={option} isSelected={isSelected} />
    </li>
  );
};
