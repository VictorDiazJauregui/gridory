import * as React from "react";
import { Slot } from "radix-ui";

import { cn } from "../../lib/cn";

export type ButtonVariant =
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link";

export type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg";

/**
 * Button primitive: one class hook (`gdy-button`) plus `data-variant` and
 * `data-size`, styled in src/components/ui/styles.css. Any class passed through
 * `className` is appended after the hook.
 */
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    asChild?: boolean;
  }
>(
  (
    {
      className,
      variant = "default",
      size = "default",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot.Root : "button";

    return (
      <Comp
        ref={ref}
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn("gdy-button", className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
