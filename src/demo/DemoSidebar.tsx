import { DemoModuleNav } from "./DemoModuleNav";
import { DemoThemeToggle } from "./DemoThemeToggle";

interface DemoSidebarProps {
  selectedModuleId: string;
  onSelect: (moduleId: string) => void;
}

export const DemoSidebar = ({
  selectedModuleId,
  onSelect,
}: DemoSidebarProps) => (
  <aside className="w-64 border-r border-border bg-card flex flex-col">
    <div className="px-4 py-4 border-b border-border font-semibold">
      Módulos
    </div>
    <DemoModuleNav selectedModuleId={selectedModuleId} onSelect={onSelect} />
    <DemoThemeToggle />
  </aside>
);
