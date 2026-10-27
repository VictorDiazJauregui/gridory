import { Loader } from "lucide-react";

interface LoadingToggleProps {
  loading: boolean;
  onToggle: () => void;
}

export const LoadingToggle = ({ loading, onToggle }: LoadingToggleProps) => (
  <button
    type="button"
    aria-pressed={loading}
    onClick={onToggle}
    className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs text-muted-foreground aria-pressed:bg-muted aria-pressed:text-foreground"
  >
    <Loader size={14} />
    Cargando
  </button>
);
