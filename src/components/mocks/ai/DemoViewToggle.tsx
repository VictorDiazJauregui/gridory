import type { DemoView } from "./ai-config";

interface DemoViewToggleProps {
  view: DemoView;
  onChange: (view: DemoView) => void;
}

const VIEW_OPTIONS: { value: DemoView; label: string }[] = [
  { value: "table", label: "Tabla" },
  { value: "kanban", label: "Kanban" },
];

const resolveButtonClassName = (active: boolean) =>
  `rounded px-3 py-1 text-xs font-medium ${
    active
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:text-foreground"
  }`;

export const DemoViewToggle = ({ view, onChange }: DemoViewToggleProps) => (
  <div className="inline-flex rounded-md border bg-muted p-1">
    {VIEW_OPTIONS.map((option) => (
      <button
        key={option.value}
        type="button"
        className={resolveButtonClassName(view === option.value)}
        onClick={() => onChange(option.value)}
      >
        {option.label}
      </button>
    ))}
  </div>
);
