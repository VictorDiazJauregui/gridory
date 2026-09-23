import { LayoutGrid, Table2 } from "lucide-react";
import type { ViewMode, ViewSwitchConfig } from "./types";
import { cn } from "./utils";

interface ToolbarViewSwitchProps {
  config: ViewSwitchConfig;
}

export const ToolbarViewSwitch = ({ config }: ToolbarViewSwitchProps) => {
  const selectView = (view: ViewMode) => {
    if (config.active === view) return;
    config.onChange(view);
  };

  const isTableActive = config.active === "table";
  const isKanbanActive = config.active === "kanban";

  return (
    <div className="rdt-view-switch">
      <button
        type="button"
        className={cn(
          "rdt-view-switch-btn",
          isTableActive && "rdt-view-switch-btn-active",
        )}
        aria-pressed={isTableActive}
        onClick={() => selectView("table")}
      >
        <Table2 size={14} />
        {config.tableLabel ?? "Tabla"}
      </button>
      <button
        type="button"
        className={cn(
          "rdt-view-switch-btn",
          isKanbanActive && "rdt-view-switch-btn-active",
        )}
        aria-pressed={isKanbanActive}
        onClick={() => selectView("kanban")}
      >
        <LayoutGrid size={14} />
        {config.kanbanLabel ?? "Kanban"}
      </button>
    </div>
  );
};
