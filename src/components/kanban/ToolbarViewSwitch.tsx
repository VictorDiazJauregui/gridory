import { LayoutGrid, Table2 } from "lucide-react";
import type { ReusableViewMode, ReusableViewSwitchConfig } from "./types";
import { cn } from "./utils";

interface ToolbarViewSwitchProps {
  config: ReusableViewSwitchConfig;
}

export const ToolbarViewSwitch = ({ config }: ToolbarViewSwitchProps) => {
  const { active, onChange, tableLabel, kanbanLabel } = config;

  const selectView = (view: ReusableViewMode) => {
    if (view === active) return;
    onChange(view);
  };

  return (
    <div className="rkb-view-switch">
      <button
        type="button"
        className={cn(
          "rkb-view-switch-btn",
          active === "table" && "rkb-view-switch-btn-active",
        )}
        aria-pressed={active === "table"}
        onClick={() => selectView("table")}
      >
        <Table2 size={14} />
        {tableLabel ?? "Tabla"}
      </button>
      <button
        type="button"
        className={cn(
          "rkb-view-switch-btn",
          active === "kanban" && "rkb-view-switch-btn-active",
        )}
        aria-pressed={active === "kanban"}
        onClick={() => selectView("kanban")}
      >
        <LayoutGrid size={14} />
        {kanbanLabel ?? "Kanban"}
      </button>
    </div>
  );
};
