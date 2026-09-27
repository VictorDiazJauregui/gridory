import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Dialog, VisuallyHidden } from "radix-ui";
import { cn } from "../../../lib/cn";
import { useSidebarContext } from "../model/sidebar-context";

interface MobileDrawerProps {
  children: ReactNode;
  className?: string;
}

// Radix Dialog traps the focus, closes on Escape or on the overlay, locks the page
// scroll and gives the focus back to the menu button.
export const MobileDrawer = ({ children, className }: MobileDrawerProps) => {
  const { texts } = useSidebarContext("Sidebar");
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="gdy-scope gdy-sidebar-overlay" />
      <Dialog.Content className={cn("gdy-scope gdy-sidebar-drawer", className)} aria-describedby={undefined}>
        <VisuallyHidden.Root asChild>
          <Dialog.Title>{texts.menuTitle}</Dialog.Title>
        </VisuallyHidden.Root>
        <Dialog.Close className="gdy-sidebar-drawer-close" aria-label={texts.closeMenu}>
          <X />
        </Dialog.Close>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
};
