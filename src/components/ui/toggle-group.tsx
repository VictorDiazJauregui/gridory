import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";

import { cn } from "../../lib/utils";

function ToggleGroup({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-lg border border-border bg-muted/50 p-0.5",
        className,
      )}
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
      className={cn(
        "inline-flex h-7 items-center justify-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps {
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
            {showLabel ? <span>{option.label}</span> : null}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}

export { ToggleGroup, ToggleGroupItem, SegmentedControl };
