import { Download } from "lucide-react";
import { useDemoText } from "../shared/demo-dictionary";

interface ExportSelectedButtonProps {
  selectedIds: string[];
}

// The table only reports the ids: what to do with them is the app's call, here an alert.
export const ExportSelectedButton = ({ selectedIds }: ExportSelectedButtonProps) => {
  const translate = useDemoText();
  return (
    <button
      type="button"
      disabled={selectedIds.length === 0}
      onClick={() => window.alert(`${translate("Exportar")}: ${selectedIds.join(", ")}`)}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs text-muted-foreground disabled:opacity-50"
    >
      <Download size={14} />
      {`${translate("Exportar")} (${selectedIds.length})`}
    </button>
  );
};
