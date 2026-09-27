import type { SidebarFrameConfig } from "./SidebarFrame";

export const STRUCTURE_EXAMPLE: SidebarFrameConfig = { name: "Muchos ítems", itemCount: 60, pinPlacement: "header" };

export const MODE_EXAMPLES: SidebarFrameConfig[] = [
  { name: "Botón en la cabecera", itemCount: 8, pinPlacement: "header" },
  { name: "Botón en el pie", itemCount: 8, pinPlacement: "footer" },
];

export const TOOLTIP_EXAMPLE: SidebarFrameConfig = {
  name: "Sin despliegue por hover",
  itemCount: 8,
  pinPlacement: "header",
  expandOnHover: false,
};

export const CUSTOM_TOKENS_EXAMPLE: SidebarFrameConfig = {
  name: "Personalizado",
  itemCount: 12,
  pinPlacement: "footer",
  tokens: {
    "--gdy-sidebar-rail-width": "64px",
    "--gdy-sidebar-width": "240px",
    "--gdy-sidebar-bg": "var(--gdy-primary)",
    "--gdy-sidebar-fg": "var(--gdy-primary-foreground)",
    "--gdy-sidebar-border": "transparent",
    "--gdy-sidebar-item-hover-bg": "color-mix(in oklch, var(--gdy-primary-foreground) 12%, transparent)",
    "--gdy-sidebar-item-active-bg": "var(--gdy-primary-foreground)",
    "--gdy-sidebar-item-active-fg": "var(--gdy-primary)",
    "--gdy-sidebar-separator-color": "color-mix(in oklch, var(--gdy-primary-foreground) 25%, transparent)",
    "--gdy-sidebar-pin-color": "var(--gdy-primary-foreground)",
  } as SidebarFrameConfig["tokens"],
};
