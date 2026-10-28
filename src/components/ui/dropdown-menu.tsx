import * as React from "react";
import { ChevronRight } from "lucide-react";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";

import { cn } from "../../lib/cn";

const DropdownMenu = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) => {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

const DropdownMenuTrigger = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) => {
  return (
    <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
  );
}

const DropdownMenuContent = ({
  className,
  sideOffset = 6,
  collisionPadding = 8,
  align = "end",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Content>) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        align={align}
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn("gdy-scope gdy-menu-content", className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

const DropdownMenuItem = ({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  variant?: "default" | "destructive";
}) => {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn("gdy-menu-item", className)}
      {...props}
    />
  );
}

const DropdownMenuLabel = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Label>) => {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      className={cn("gdy-menu-label", className)}
      {...props}
    />
  );
}

const DropdownMenuSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) => {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("gdy-menu-separator", className)}
      {...props}
    />
  );
}

const DropdownMenuSub = ({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) => {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}

const DropdownMenuSubTrigger = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger>) => {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      className={cn("gdy-menu-item gdy-menu-sub-trigger", className)}
      {...props}
    >
      {children}
      <ChevronRight className="gdy-menu-sub-chevron" aria-hidden="true" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

const DropdownMenuSubContent = ({
  className,
  sideOffset = 4,
  collisionPadding = 8,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.SubContent
        data-slot="dropdown-menu-sub-content"
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn("gdy-scope gdy-menu-content gdy-menu-sub-content", className)}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
