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
      className="rkb-btn rkb-btn-ai"
      onClick={config.onClick}
      aria-label={label}
    >
      <Sparkles size={14} />
      {label}
    </button>
  );
};
