import * as React from "react";
import { Popover as PopoverPrimitive } from "radix-ui";

import { cn } from "../../lib/cn";

const Popover = ({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) => {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

const PopoverTrigger = ({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) => {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

const PopoverContent = ({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) => {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn("gdy-scope gdy-popover-content", className)}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

export { Popover, PopoverContent, PopoverTrigger };
