import { MODULES } from "./demo-modules";

interface DemoModuleNavProps {
  selectedModuleId: string;
  onSelect: (moduleId: string) => void;
}

const resolveModuleClassName = (active: boolean) =>
  `w-full text-left px-3 py-2 mb-1 rounded ${
    active
      ? "bg-primary text-primary-foreground"
      : "text-foreground hover:bg-muted"
  }`;

export const DemoModuleNav = ({
  selectedModuleId,
  onSelect,
}: DemoModuleNavProps) => (
  <nav className="p-2 flex-1">
    {MODULES.map((module) => (
      <button
        key={module.id}
        onClick={() => onSelect(module.id)}
        className={resolveModuleClassName(module.id === selectedModuleId)}
      >
        {module.label}
      </button>
    ))}
  </nav>
);
