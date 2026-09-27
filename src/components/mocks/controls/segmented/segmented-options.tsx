import type { CSSProperties } from "react";
import { Briefcase, Layers, User } from "lucide-react";
import type { SegmentedOption } from "../../../segmented-control";

export const COMPANY_VIEW_OPTIONS: SegmentedOption[] = [
  { value: "companies", label: "Mis empresas", icon: <Briefcase /> },
  { value: "team", label: "Equipo", icon: <User /> },
  { value: "services", label: "Servicios", icon: <Layers /> },
];

export const CALENDAR_VIEW_OPTIONS: SegmentedOption[] = [
  { value: "month", label: "Mes" },
  { value: "week", label: "Semana" },
  { value: "day", label: "Día" },
  { value: "assigned", label: "Designados" },
];

// Restyles the control through its tokens alone: a pill in the primary color.
export const CUSTOM_SEGMENTED_TOKENS = {
  "--gdy-segmented-radius": "9999px",
  "--gdy-segmented-item-radius": "9999px",
  "--gdy-segmented-indicator-bg": "var(--gdy-primary)",
  "--gdy-segmented-item-active-color": "var(--gdy-primary-foreground)",
  "--gdy-segmented-font-size": "0.9375rem",
} as CSSProperties;
