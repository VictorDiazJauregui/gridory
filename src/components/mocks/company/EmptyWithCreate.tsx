import { Plus, SearchX } from "lucide-react";
import { useDemoText } from "../shared/demo-dictionary";

interface EmptyWithCreateProps {
  onCreate: () => void;
}

// Demo of `emptyMessage` as a node: an icon, the text and an action that creates a row.
export const EmptyWithCreate = ({ onCreate }: EmptyWithCreateProps) => {
  const translate = useDemoText();
  return (
    <div className="flex flex-col items-center gap-2">
      <SearchX size={20} aria-hidden="true" />
      <span>{translate("Ninguna empresa coincide con la búsqueda.")}</span>
      <button type="button" className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-muted" onClick={onCreate}>
        <Plus size={14} aria-hidden="true" />
        {translate("Crear empresa")}
      </button>
    </div>
  );
};
