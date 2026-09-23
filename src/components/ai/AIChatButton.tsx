import type { ButtonHTMLAttributes } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/cn";
import "./styles.css";

interface AIChatButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

/**
 * Launcher button. The host places it in its own toolbar, outside any Gridory
 * root, so it carries `gdy-scope` itself. Hooks: `gdy-ai-button` on the
 * button primitive (outline, sm), `gdy-ai-button-icon` and
 * `gdy-ai-button-label` (hidden below 640px). Styles in ./styles.css.
 */
export function AIChatButton({
  label = "AI",
  className,
  type,
  ...props
}: AIChatButtonProps) {
  return (
    <Button
      type={type ?? "button"}
      variant="outline"
      size="sm"
      className={cn("gdy-scope gdy-ai-button", className)}
      {...props}
    >
      <Sparkles className="gdy-ai-button-icon" />
      <span className="gdy-ai-button-label">{label}</span>
    </Button>
  );
}
