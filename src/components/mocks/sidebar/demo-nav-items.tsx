import type { ReactNode } from "react";
import { BarChart3, Bell, Calendar, FileText, Folder, Inbox, LayoutDashboard, Mail, Settings, Users } from "lucide-react";

export interface DemoNavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

const ICONS = [LayoutDashboard, Inbox, Calendar, Users, FileText, Folder, Mail, BarChart3, Bell, Settings];
const LABELS = ["Tablero", "Bandeja", "Calendario", "Clientes", "Documentos", "Proyectos", "Correo", "Reportes", "Avisos", "Ajustes"];

export const SEPARATOR_EVERY = 10;

export const buildDemoNavItems = (count: number): DemoNavItem[] =>
  Array.from({ length: count }, (_, index) => {
    const Icon = ICONS[index % ICONS.length];
    const round = Math.floor(index / LABELS.length);
    const label = LABELS[index % LABELS.length];
    return { id: `item-${index}`, label: round === 0 ? label : `${label} ${round + 1}`, icon: <Icon /> };
  });

export const SETTINGS_ITEM: DemoNavItem = { id: "settings", label: "Configuración", icon: <Settings /> };
