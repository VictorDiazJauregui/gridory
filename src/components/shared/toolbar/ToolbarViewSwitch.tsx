import { LayoutGrid, Table2 } from "lucide-react";
import type { ViewSwitchConfig } from "../data-model";
import type { DataViewLabels } from "../labels/data-view-labels";
import { ToolbarViewSwitchButton } from "./ToolbarViewSwitchButton";

interface ToolbarViewSwitchProps {
  config: ViewSwitchConfig;
  labels: Pick<DataViewLabels, "viewSwitchTable" | "viewSwitchKanban">;
}

export const ToolbarViewSwitch = ({ config, labels }: ToolbarViewSwitchProps) => (
  <div className="gdy-view-switch">
    <ToolbarViewSwitchButton
      view="table"
      config={config}
      icon={Table2}
      label={config.tableLabel ?? labels.viewSwitchTable}
    />
    <ToolbarViewSwitchButton
      view="kanban"
      config={config}
      icon={LayoutGrid}
      label={config.kanbanLabel ?? labels.viewSwitchKanban}
    />
  </div>
);
