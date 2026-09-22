import type { ButtonHTMLAttributes } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

interface AIChatButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

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
      className={cn(
        "h-8 gap-1.5 border-primary/30 text-xs text-primary hover:bg-primary/5",
        className,
      )}
      {...props}
    >
      <Sparkles className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
