import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "../../lib/cn";
import {
  selectThemeToVars,
  type SelectTheme,
} from "../shared/select-theme";

function Select({ ...props }: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className="gdy-select-value"
      {...props}
    />
  );
}

function SelectTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      className={cn("gdy-select-trigger", className)}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="gdy-select-icon" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        position={position}
        className={cn("gdy-scope gdy-select-content", className)}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport className="gdy-select-viewport">
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn("gdy-select-item", className)}
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="gdy-select-item-indicator">
        <CheckIcon className="gdy-select-item-check" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText className="gdy-select-item-text">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn("gdy-select-scroll-button", className)}
      {...props}
    >
      <ChevronUpIcon className="gdy-select-scroll-icon" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn("gdy-select-scroll-button", className)}
      {...props}
    >
      <ChevronDownIcon className="gdy-select-scroll-icon" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export interface SimpleSelectOption {
  value: string;
  label: string;
}

export interface SimpleSelectProps {
  options: SimpleSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  triggerClassName?: string;
  triggerStyle?: React.CSSProperties;
  disabled?: boolean;
  theme?: SelectTheme;
}

function SimpleSelect({
  options,
  value,
  onValueChange,
  placeholder,
  ariaLabel,
  triggerClassName,
  triggerStyle,
  disabled,
  theme,
}: SimpleSelectProps) {
  const hasValue = options.some((option) => option.value === value);
  const themeVars = selectThemeToVars(theme);
  return (
    <Select
      value={hasValue ? value : undefined}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        aria-label={ariaLabel}
        className={cn(theme?.triggerClassName, triggerClassName)}
        style={{ ...themeVars, ...triggerStyle }}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={theme?.contentClassName} style={themeVars}>
        {options.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={theme?.itemClassName}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export { SimpleSelect };
