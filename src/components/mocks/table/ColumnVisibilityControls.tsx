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
        className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs text-muted-foreground aria-pressed:bg-muted aria-pressed:text-foreground"
      >
        <Columns3 size={14} />
        {translate("Ocultar Notas")}
      </button>
      <span className="text-xs text-muted-foreground" aria-live="polite">
        {`${translate("Columnas ocultas")}: ${hiddenCount}`}
      </span>
    </span>
  );
};
