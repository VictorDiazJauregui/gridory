import { Sparkles } from "lucide-react";
import type { AiButtonConfig } from "./types";

interface ToolbarAiButtonProps {
  config: AiButtonConfig;
}

export const ToolbarAiButton = ({ config }: ToolbarAiButtonProps) => {
  const label = config.label ?? "AI";

  return (
    <button
      type="button"
      className="rdt-btn rdt-btn-ai"
      aria-label={label}
      onClick={config.onClick}
    >
      <Sparkles size={14} />
      {label}
    </button>
  );
};
