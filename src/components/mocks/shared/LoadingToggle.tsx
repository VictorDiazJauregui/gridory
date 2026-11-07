import { Loader } from "lucide-react";
import { useDemoText } from "./demo-dictionary";

interface LoadingToggleProps {
  loading: boolean;
  onToggle: () => void;
}

export const LoadingToggle = ({ loading, onToggle }: LoadingToggleProps) => {
  const translate = useDemoText();
  return (
    <button
      type="button"
      aria-pressed={loading}
      onClick={onToggle}
      className="inline-flex h-8 items-center gap-1.5 rounded-gdy-md border px-2.5 text-xs text-gdy-muted-foreground aria-pressed:bg-gdy-muted aria-pressed:text-gdy-foreground"
    >
      <Loader size={14} />
      {translate("Cargando")}
    </button>
  );
};
