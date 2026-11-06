import { Check, Minus } from "lucide-react";
import { Checkbox } from "radix-ui";
import { useFocusOnMount } from "../../shared/deferred/use-placeholder-focus";
import type { HeaderCheckState } from "./row-selection";

export interface SelectCheckboxProps {
  checked: HeaderCheckState;
  label: string;
  disabled?: boolean;
  onToggle: () => void;
  initiallyFocused?: boolean;
}

// Radix renders the partial state as aria-checked="mixed", which a native checkbox cannot carry.
export const SelectCheckbox = ({ checked, label, disabled, onToggle, initiallyFocused }: SelectCheckboxProps) => {
  const rootRef = useFocusOnMount<HTMLButtonElement>(initiallyFocused);
  return (
    <Checkbox.Root
      ref={rootRef}
      className="gdy-table-select"
      checked={checked}
      disabled={disabled}
      aria-label={label}
      onCheckedChange={onToggle}
    >
      <Checkbox.Indicator className="gdy-table-select-indicator">
        {checked === "indeterminate" ? <Minus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
};
