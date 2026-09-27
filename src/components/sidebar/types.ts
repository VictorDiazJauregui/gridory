import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";
import type { AccessibleName } from "../shared/accessible-name";

/** Every text the sidebar shows or announces. All are replaceable through `texts`. */
export interface SidebarTexts {
  /** Accessible name of the pin button while the sidebar expands on hover and is not pinned. */
  pin: string;
  unpin: string;
  /** Accessible name of the same button when hover expansion is off (`expandOnHover={false}`). */
  expand: string;
  collapse: string;
  openMenu: string;
  closeMenu: string;
  /** Accessible title of the mobile drawer. */
  menuTitle: string;
}

export interface SidebarLayoutProps {
  /** The `Sidebar` and the page content, in that order. */
  children: ReactNode;
  /** Controlled pinned state. Leave it out and use `defaultPinned` for an uncontrolled sidebar. */
  pinned?: boolean;
  defaultPinned?: boolean;
  /** Fires when the pin button (or `useSidebar().setPinned`) changes the pinned state. */
  onPinnedChange?: (pinned: boolean) => void;
  /** Expands the collapsed sidebar over the content while the pointer or the focus is inside. */
  expandOnHover?: boolean;
  /** Milliseconds the pointer has to rest on the rail before it expands. */
  hoverOpenDelay?: number;
  /** Milliseconds after the pointer leaves before it collapses again. */
  hoverCloseDelay?: number;
  /** Below this viewport width (in px) the sidebar becomes a top bar with a drawer. */
  mobileBreakpoint?: number;
  /** Animates the width change. `prefers-reduced-motion` switches it off too. */
  animated?: boolean;
  texts?: Partial<SidebarTexts>;
  className?: string;
}

/** One class per part, added next to the `gdy-sidebar-*` hooks. */
export interface SidebarClassNames {
  root?: string;
  panel?: string;
  mobileBar?: string;
  drawer?: string;
}

interface SidebarBaseProps {
  /** `SidebarHeader`, `SidebarContent` and `SidebarFooter`. */
  children: ReactNode;
  /** Shown next to the menu button in the mobile top bar, usually the logo. */
  mobileBarLogo?: ReactNode;
  /** Shown at the end of the mobile top bar. */
  mobileBarEnd?: ReactNode;
  className?: string;
  classNames?: SidebarClassNames;
}

/** The navigation needs a name: pass `aria-label` or `aria-labelledby`. */
export type SidebarProps = SidebarBaseProps & AccessibleName;

export interface SidebarZoneProps {
  children?: ReactNode;
  className?: string;
}

export interface SidebarLogoProps {
  /** Shown while the sidebar is expanded, and in the mobile drawer. */
  full: ReactNode;
  /** Shown in the collapsed rail. Without it the full logo stays, clipped by the rail. */
  compact?: ReactNode;
  className?: string;
}

type NativeItemAttributes = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onSelect">;

export interface SidebarItemProps extends NativeItemAttributes {
  /** Decorative: the item is named by its label, also while collapsed. */
  icon: ReactNode;
  label: string;
  /** Marks the current page (`aria-current="page"`). */
  active?: boolean;
  /** Fires on click. On mobile the drawer closes right after. */
  onSelect?: () => void;
  /** Renders the single child (a link of your router) instead of a button. */
  asChild?: boolean;
  children?: ReactElement;
}

export interface SidebarSeparatorProps {
  className?: string;
}

export interface SidebarPinButtonProps {
  className?: string;
}

/** What `useSidebar()` gives custom blocks. */
export interface SidebarState {
  /** The desktop sidebar shows only the icon rail. Always `false` on mobile. */
  collapsed: boolean;
  pinned: boolean;
  isMobile: boolean;
  expandOnHover: boolean;
  setPinned: (pinned: boolean) => void;
  /**
   * Keeps the sidebar expanded until the returned function is called, for a block
   * whose menu opens in a portal: the pointer leaving for the portal would collapse it.
   */
  retainExpanded: () => () => void;
}
