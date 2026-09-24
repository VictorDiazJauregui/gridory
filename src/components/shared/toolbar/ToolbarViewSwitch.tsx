import { LayoutGrid, Table2 } from "lucide-react";
import type { ViewSwitchConfig } from "../data-model";
import { ToolbarViewSwitchButton } from "./ToolbarViewSwitchButton";

interface ToolbarViewSwitchProps {
  config: ViewSwitchConfig;
}

export const ToolbarViewSwitch = ({ config }: ToolbarViewSwitchProps) => (
  <div className="gdy-view-switch">
    <ToolbarViewSwitchButton
      view="table"
      config={config}
      icon={Table2}
      label={config.tableLabel ?? "Tabla"}
    />
    <ToolbarViewSwitchButton
      view="kanban"
      config={config}
      icon={LayoutGrid}
      label={config.kanbanLabel ?? "Kanban"}
    />
  </div>
);
