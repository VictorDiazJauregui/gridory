import { LayoutGrid, SquareKanban, Table2 } from "lucide-react";
import type { ToggleGroupConfig } from "../../card-grid";

export type DemoView = "table" | "cards" | "kanban";

export const buildViewToggleGroup = (value: DemoView, onChange: (view: DemoView) => void): ToggleGroupConfig => ({
  id: "view",
  ariaLabel: "Vista",
  value,
  onChange: (next) => onChange(next as DemoView),
  position: "left",
  options: [
    { value: "table", label: "Tabla", icon: <Table2 size={14} /> },
    { value: "cards", label: "Tarjetas", icon: <LayoutGrid size={14} /> },
    { value: "kanban", label: "Kanban", icon: <SquareKanban size={14} /> },
  ],
});
