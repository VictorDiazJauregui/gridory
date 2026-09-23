import { Sparkles } from "lucide-react";
import { cn } from "../../lib/cn";
import { AIChatHeaderControls } from "./AIChatHeaderControls";
import type { SidebarViewProps } from "./use-sidebar-view";

export const AIChatHeader = ({ view }: SidebarViewProps) => (
  <header className={cn("gdy-ai-header", view.classNames?.header)}>
    <div className="gdy-ai-header-badge">
      <Sparkles className="gdy-ai-header-icon" />
    </div>
    <div className="gdy-ai-heading">
      <h2 className="gdy-ai-title">{view.title}</h2>
      <p className="gdy-ai-subtitle">{view.subtitle}</p>
    </div>
    <AIChatHeaderControls view={view} />
  </header>
);
