import { Columns3 } from "lucide-react";
import { useDemoText } from "../shared/demo-dictionary";

interface ColumnVisibilityControlsProps {
  hideNotes: boolean;
  onToggleNotes: () => void;
  hiddenCount: number;
}

// The count comes from onColumnVisibilityChange: the table reports, the app decides what to show.
export const ColumnVisibilityControls = ({ hideNotes, onToggleNotes, hiddenCount }: ColumnVisibilityControlsProps) => {
  const translate = useDemoText();
  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        aria-pressed={hideNotes}
        onClick={onToggleNotes}
        className="inline-flex h-8 items-center gap-1.5 rounded-gdy-md border px-2.5 text-xs text-gdy-muted-foreground aria-pressed:bg-gdy-muted aria-pressed:text-gdy-foreground"
      >
        <Columns3 size={14} />
        {translate("Ocultar Notas")}
      </button>
      <span className="text-xs text-gdy-muted-foreground" aria-live="polite">
        {`${translate("Columnas ocultas")}: ${hiddenCount}`}
      </span>
    </span>
  );
};
