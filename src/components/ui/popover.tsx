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

const PopoverAnchor = (props: React.ComponentProps<typeof PopoverPrimitive.Anchor>) => (
  <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
);

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      data-slot="popover-content"
      align={align}
      sideOffset={sideOffset}
      className={cn("gdy-scope gdy-popover-content", className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverAnchor, PopoverContent, PopoverTrigger };
