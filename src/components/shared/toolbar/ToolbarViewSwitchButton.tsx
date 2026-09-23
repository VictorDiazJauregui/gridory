import type { LucideIcon } from "lucide-react";
import type { ViewMode, ViewSwitchConfig } from "../data-model";

interface ToolbarViewSwitchButtonProps {
  view: ViewMode;
  config: ViewSwitchConfig;
  icon: LucideIcon;
  label: string;
}

const selectView = (config: ViewSwitchConfig, view: ViewMode) => {
  if (config.active === view) return;
  config.onChange(view);
};

export const ToolbarViewSwitchButton = ({
  view,
  config,
  icon: Icon,
  label,
}: ToolbarViewSwitchButtonProps) => (
  <button
    type="button"
    className="gdy-view-switch-btn"
    aria-pressed={config.active === view}
    onClick={() => selectView(config, view)}
  >
    <Icon size={14} className="gdy-view-switch-icon" />
    {label}
  </button>
);
