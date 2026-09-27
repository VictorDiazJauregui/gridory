import type { SidebarTexts } from "./types";

export const DEFAULT_SIDEBAR_TEXTS: SidebarTexts = {
  pin: "Fijar menú",
  unpin: "Soltar menú",
  expand: "Expandir menú",
  collapse: "Colapsar menú",
  openMenu: "Abrir menú",
  closeMenu: "Cerrar menú",
  menuTitle: "Menú de navegación",
};

export const SIDEBAR_DEFAULTS = {
  expandOnHover: true,
  hoverOpenDelay: 150,
  hoverCloseDelay: 300,
  mobileBreakpoint: 768,
  animated: true,
} as const;
