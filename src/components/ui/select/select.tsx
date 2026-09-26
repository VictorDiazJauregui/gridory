import * as React from "react";

import type { SelectTheme } from "../../shared/select-theme";
import { Select } from "./select-primitives";
import { SimpleSelectContent } from "./simple-select-content";
import { SimpleSelectTrigger } from "./simple-select-trigger";

export interface SimpleSelectOption {
  value: string;
  label: string;
}

export type SelectTriggerAttributes = Pick<
  React.ComponentProps<"button">,
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

const SimpleSelect = ({
  options,
  value,
  onValueChange,
  disabled,
  theme,
  ...triggerProps
}: SimpleSelectProps) => {
  const hasValue = options.some((option) => option.value === value);
  return (
    <Select
      value={hasValue ? value : ""}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SimpleSelectTrigger theme={theme} {...triggerProps} />
      <SimpleSelectContent options={options} theme={theme} />
    </Select>
  );
}

export { SimpleSelect };
