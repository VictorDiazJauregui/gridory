import { MoveHorizontal } from "lucide-react";
import { useDemoText } from "../shared/demo-dictionary";

interface ColumnWidthsControlsProps {
  savedCount: number;
  onReset: () => void;
}

// The count comes from onColumnWidthsChange: the table reports on release, the demo saves and counts.
export const ColumnWidthsControls = ({ savedCount, onReset }: ColumnWidthsControlsProps) => {
  const translate = useDemoText();
  return (
    <span className="inline-flex items-center gap-1.5">
      <button
        type="button"
        onClick={onReset}
        disabled={savedCount === 0}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs text-muted-foreground disabled:opacity-50"
      >
        <MoveHorizontal size={14} />
        {translate("Restablecer anchos")}
      </button>
      <span className="text-xs text-muted-foreground" aria-live="polite">
        {`${translate("Anchos guardados")}: ${savedCount}`}
      </span>
    </span>
  );
};
