import type { SidebarViewProps } from "./use-sidebar-view";

export const AIChatOverlay = ({ view }: SidebarViewProps) => {
  if (!view.open) return null;
  return <div className="gdy-scope gdy-ai-overlay" onClick={view.onClose} />;
};
