import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";

import { cn } from "../../lib/cn";

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn("gdy-toggle-group", className)}
      {...props}
    />
  );
}

function ToggleGroupItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      className={cn("gdy-toggle-item", className)}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  options: SegmentedControlOption[];
  value: string;
  onChange: (value: string) => void;
  display?: "label" | "icon" | "both";
  ariaLabel?: string;
  className?: string;
}

function resolveDisplay(
  option: SegmentedControlOption,
  display: "label" | "icon" | "both",
) {
  const showIcon = Boolean(option.icon) && display !== "label";
  const showLabel = display !== "icon" || !option.icon;
  return { showIcon, showLabel };
}

function SegmentedControl({
  options,
  value,
  onChange,
  display = "both",
  ariaLabel,
  className,
}: SegmentedControlProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      aria-label={ariaLabel}
      onValueChange={(next) => next && onChange(next)}
      className={className}
    >
      {options.map((option) => {
        const { showIcon, showLabel } = resolveDisplay(option, display);
        return (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            aria-label={option.label}
            title={option.label}
          >
            {showIcon ? option.icon : null}
            {showLabel ? (
              <span className="gdy-toggle-item-label">{option.label}</span>
            ) : null}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}

export { SegmentedControl };
