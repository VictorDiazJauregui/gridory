import { Sparkles } from "lucide-react";
import type { AiButtonConfig } from "../data-model";

interface ToolbarAiButtonProps {
  config: AiButtonConfig;
}

export const ToolbarAiButton = ({ config }: ToolbarAiButtonProps) => {
  const label = config.label ?? "AI";

  return (
    <button
      type="button"
      className="gdy-btn gdy-btn-ai"
      aria-label={label}
      onClick={config.onClick}
    >
      <Sparkles size={14} className="gdy-btn-ai-icon" />
      {label}
    </button>
  );
};
