import type { KeyboardEvent } from "react";
import { Check, Minus } from "lucide-react";
import type { HeaderCheckState } from "./row-selection";

export interface SelectCheckboxProps {
  checked: HeaderCheckState;
  label: string;
  disabled?: boolean;
  onToggle: () => void;
}

const toCheckState = (checked: HeaderCheckState) => {
  if (checked === "indeterminate") return { state: "indeterminate", aria: "mixed" } as const;
  return checked ? ({ state: "checked", aria: true } as const) : ({ state: "unchecked", aria: false } as const);
};

// Like the Radix checkbox it replaces, Enter does not toggle: only Space (the button's click) does.
const ignoreEnter = (event: KeyboardEvent) => {
  if (event.key === "Enter") event.preventDefault();
};

const disabledAttribute = (disabled?: boolean) => (disabled ? "" : undefined);

const CheckIndicator = ({ state, disabled }: { state: "checked" | "indeterminate"; disabled?: boolean }) => (
  <span data-state={state} data-disabled={disabledAttribute(disabled)} className="gdy-table-select-indicator" style={{ pointerEvents: "none" }}>
    {state === "indeterminate" ? <Minus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
  </span>
);

// A button with role="checkbox" and the markup Radix rendered (data-state, data-disabled), because the partial
// state of the header needs aria-checked="mixed" and the consumers' CSS reads data-state.
export const SelectCheckbox = ({ checked, label, disabled, onToggle }: SelectCheckboxProps) => {
  const { state, aria } = toCheckState(checked);
  return (
    <button type="button" role="checkbox" aria-checked={aria} data-state={state} data-disabled={disabledAttribute(disabled)}
      disabled={disabled} value="on" className="gdy-table-select" aria-label={label} onClick={onToggle} onKeyDown={ignoreEnter}>
      {state !== "unchecked" && <CheckIndicator state={state} disabled={disabled} />}
    </button>
  );
};
