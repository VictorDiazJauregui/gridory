import { Menu } from "lucide-react";
import { Dialog } from "radix-ui";
import { cn } from "../../../lib/cn";
import { useSidebarContext } from "../model/sidebar-context";
import type { SidebarProps } from "../types";
import { MobileDrawer } from "./MobileDrawer";

export const MobileSidebar = ({ children, mobileBarLogo, mobileBarEnd, className, classNames }: SidebarProps) => {
  const { texts, mobileMenu } = useSidebarContext("Sidebar");
  return (
    <Dialog.Root open={mobileMenu.open} onOpenChange={mobileMenu.setOpen}>
      <header className={cn("gdy-scope gdy-sidebar-mobile-bar", className, classNames?.mobileBar)} data-mobile="true">
        <Dialog.Trigger className="gdy-sidebar-menu-button" aria-label={texts.openMenu}>
          <Menu />
        </Dialog.Trigger>
        {mobileBarLogo ? <div className="gdy-sidebar-mobile-logo">{mobileBarLogo}</div> : null}
        {mobileBarEnd ? <div className="gdy-sidebar-mobile-end">{mobileBarEnd}</div> : null}
      </header>
      <MobileDrawer className={classNames?.drawer}>{children}</MobileDrawer>
    </Dialog.Root>
  );
};
