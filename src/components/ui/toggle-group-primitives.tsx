import * as React from "react";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";

import { cn } from "../../lib/cn";

const ToggleGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root>) => {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn("gdy-toggle-group", className)}
      {...props}
    />
  );
}

const ToggleGroupItem = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) => {
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

export { ToggleGroup, ToggleGroupItem };
