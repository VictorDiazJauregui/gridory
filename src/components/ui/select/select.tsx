import type * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "../../../lib/cn";
import { selectThemeToVars, type SelectTheme } from "../../shared/select-theme";

export interface SimpleSelectOption {
  value: string;
  label: string;
}

export type SelectTriggerAttributes = Pick<
  React.ComponentProps<"select">,
  "id" | "aria-invalid" | "aria-required" | "aria-describedby"
>;

export interface SimpleSelectProps {
  options: SimpleSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  triggerClassName?: string;
  triggerStyle?: React.CSSProperties;
  triggerAttributes?: SelectTriggerAttributes;
  disabled?: boolean;
  theme?: SelectTheme;
}

type SelectOptionListProps = Pick<SimpleSelectProps, "options" | "placeholder"> & { hasValue: boolean };

// The placeholder is a hidden option so the closed box can show it without the list offering it.
const SelectOptionList = ({ options, placeholder, hasValue }: SelectOptionListProps) => (
  <>
    {!hasValue && <option value="" disabled hidden>{placeholder}</option>}
    {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
  </>
);

// The browser's own select: its list is the system one (a sheet or a wheel on phones), so Gridory styles only
// the closed box, and the icon sits over it because a select cannot hold children of its own.
const SimpleSelect = ({ options, value, onValueChange, placeholder, theme, ...trigger }: SimpleSelectProps) => {
  const hasValue = options.some((option) => option.value === value);
  return (
    <span className="gdy-select">
      <select
        {...trigger.triggerAttributes}
        aria-label={trigger.ariaLabel}
        disabled={trigger.disabled}
        value={hasValue ? value : ""}
        data-placeholder={hasValue ? undefined : ""}
        className={cn("gdy-select-trigger", theme?.triggerClassName, trigger.triggerClassName)}
        style={{ ...selectThemeToVars(theme), ...trigger.triggerStyle }}
        onChange={(event) => onValueChange(event.target.value)}
      >
        <SelectOptionList options={options} placeholder={placeholder} hasValue={hasValue} />
      </select>
      <ChevronDownIcon className="gdy-select-icon" aria-hidden="true" />
    </span>
  );
};

export { SimpleSelect };
