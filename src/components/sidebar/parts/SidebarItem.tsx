import { forwardRef } from "react";
import type { MouseEvent } from "react";
import { Slot } from "radix-ui";
import { cn } from "../../../lib/cn";
import { useSidebarContext } from "../model/sidebar-context";
import type { SidebarContextValue } from "../model/sidebar-context";
import type { SidebarItemProps } from "../types";
import { SidebarItemTooltip } from "./SidebarItemTooltip";

// With hover expansion on, expanding already names every icon: no tooltip then.
const showsTooltip = ({ collapsed, expandOnHover }: SidebarContextValue) => collapsed && !expandOnHover;

const useSelectHandler = ({ onClick, onSelect }: Pick<SidebarItemProps, "onClick" | "onSelect">) => {
  const { isMobile, mobileMenu } = useSidebarContext("SidebarItem");
  return (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    onSelect?.();
    if (isMobile) mobileMenu.setOpen(false);
  };
};

// Forwards its ref and any extra props: the tooltip trigger wraps it with asChild.
const SidebarItemElement = forwardRef<HTMLButtonElement, SidebarItemProps>(
  ({ icon, label, active = false, onSelect, asChild = false, children, className, onClick, ...rest }, ref) => {
    const Element = asChild ? Slot.Root : "button";
    return (
      <Element
        ref={ref}
        type={asChild ? undefined : "button"}
        {...rest}
        className={cn("gdy-sidebar-item", className)}
        aria-current={active ? "page" : undefined}
        onClick={useSelectHandler({ onClick, onSelect })}
      >
        <span className="gdy-sidebar-item-icon" aria-hidden="true">{icon}</span>
        {asChild ? <Slot.Slottable>{children}</Slot.Slottable> : null}
        <span className="gdy-sidebar-item-label">{label}</span>
      </Element>
    );
  },
);
SidebarItemElement.displayName = "SidebarItemElement";

export const SidebarItem = (props: SidebarItemProps) => {
  const context = useSidebarContext("SidebarItem");
  const element = <SidebarItemElement {...props} />;
  return showsTooltip(context) ? <SidebarItemTooltip label={props.label}>{element}</SidebarItemTooltip> : element;
};
