import { Check } from "lucide-react";
import type { FilterOption } from "../data-model";

interface FilterOptionItemProps {
  option: FilterOption;
  checked: boolean;
  onToggle: (value: string) => void;
}

export const FilterOptionItem = ({
  option,
  checked,
  onToggle,
}: FilterOptionItemProps) => (
  <button
    type="button"
    className="gdy-option-item"
    data-selected={checked || undefined}
    onClick={() => onToggle(option.value)}
  >
    <span className="gdy-option-check" data-checked={checked || undefined}>
      {checked ? <Check size={11} className="gdy-option-check-icon" /> : null}
    </span>
    <span className="gdy-option-label" title={option.label}>
      {option.label}
    </span>
  </button>
);
