import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import type { KanbanColumnProps } from "./column-settings";

interface KanbanColumnToggleProps<TData> extends KanbanColumnProps<TData> {
  collapsed: boolean;
}

export const KanbanColumnToggle = <TData,>({ value, label, collapsed, collapse, cardSettings }: KanbanColumnToggleProps<TData>) => {
  const { collapseColumn, expandColumn } = cardSettings.labels;
  const name = collapsed ? expandColumn(label) : collapseColumn(label);
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
  return (
    <button
      type="button"
      className="gdy-icon-btn gdy-kanban-column-toggle"
      aria-expanded={!collapsed}
      aria-label={name}
      title={name}
      onClick={() => collapse.toggleColumn(value)}
    >
      <Icon size={14} aria-hidden="true" />
    </button>
  );
};
