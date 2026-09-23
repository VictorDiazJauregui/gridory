import { LayoutGrid, Table2 } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { ViewMode, ViewSwitchConfig } from "../data-model";

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
    <div className="gdy-view-switch">
      <button
        type="button"
        className={cn(
          "gdy-view-switch-btn",
          isTableActive && "gdy-view-switch-btn-active",
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
          "gdy-view-switch-btn",
          isKanbanActive && "gdy-view-switch-btn-active",
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
