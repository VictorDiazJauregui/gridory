import { X } from "lucide-react";
import { Button } from "../../ui/button";
import { AIChatResetButton } from "./AIChatResetButton";
import type { SidebarViewProps } from "./use-sidebar-view";

export const AIChatHeaderControls = ({ view }: SidebarViewProps) => (
  <>
    {view.showResetButton ? <AIChatResetButton view={view} /> : null}
    <Button
      variant="ghost"
      size="icon-sm"
      className="gdy-ai-close"
      onClick={view.onClose}
      aria-label="Cerrar"
    >
      <X className="gdy-ai-close-icon" />
    </Button>
  </>
);
