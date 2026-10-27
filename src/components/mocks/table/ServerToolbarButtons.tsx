import { ChevronsLeft, Ruler } from "lucide-react";
import { useDemoText } from "../shared/demo-dictionary";

const BUTTON_CLASS =
  "inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs text-muted-foreground aria-pressed:bg-muted aria-pressed:text-foreground";

export const FirstPageButton = ({ onClick }: { onClick: () => void }) => {
  const translate = useDemoText();
  return (
    <button type="button" onClick={onClick} className={BUTTON_CLASS}>
      <ChevronsLeft size={14} />
      {translate("Volver a la página 1")}
    </button>
  );
};

interface AutoRowsToggleProps {
  active: boolean;
  onToggle: () => void;
}

export const AutoRowsToggle = ({ active, onToggle }: AutoRowsToggleProps) => {
  const translate = useDemoText();
  return (
    <button type="button" aria-pressed={active} onClick={onToggle} className={BUTTON_CLASS}>
      <Ruler size={14} />
      {translate("Filas según la altura")}
    </button>
  );
};
