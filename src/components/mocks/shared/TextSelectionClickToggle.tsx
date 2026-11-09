import { TextSelect } from "lucide-react";
import { useDemoText } from "./demo-dictionary";

interface TextSelectionClickToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export const TextSelectionClickToggle = ({ enabled, onToggle }: TextSelectionClickToggleProps) => {
  const translate = useDemoText();
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={onToggle}
      className="inline-flex h-8 items-center gap-1.5 rounded-gdy-md border px-2.5 text-xs text-gdy-muted-foreground aria-pressed:bg-gdy-muted aria-pressed:text-gdy-foreground"
    >
      <TextSelect size={14} />
      {translate("Seleccionar texto no abre")}
    </button>
  );
};
