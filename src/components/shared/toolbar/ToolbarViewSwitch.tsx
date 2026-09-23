import { LayoutGrid, Table2 } from "lucide-react";
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
        className="gdy-view-switch-btn"
        aria-pressed={isTableActive}
        onClick={() => selectView("table")}
      >
        <Table2 size={14} className="gdy-view-switch-icon" />
        {config.tableLabel ?? "Tabla"}
      </button>
      <button
        type="button"
        className="gdy-view-switch-btn"
        aria-pressed={isKanbanActive}
        onClick={() => selectView("kanban")}
      >
        <LayoutGrid size={14} className="gdy-view-switch-icon" />
        {config.kanbanLabel ?? "Kanban"}
      </button>
    </div>
  );
};
