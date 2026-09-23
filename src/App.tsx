import { useEffect, useMemo, useState, type ReactNode } from "react";
import { DataTableMock } from "@/components/mocks/DataTable.mock";
import { KanbanBoardMock } from "@/components/mocks/KanbanBoard.mock";
import { AIAssistantIntegratedMock } from "@/components/mocks/AIAssistantIntegrated.mock";

type ModuleItem = {
  id: string;
  label: string;
  content: ReactNode;
};

const MODULES: ModuleItem[] = [
  {
    id: "table",
    label: "Mock DataTable",
    content: <DataTableMock />,
  },
  {
    id: "kanban",
    label: "Mock KanbanBoard",
    content: <KanbanBoardMock />,
  },
  {
    id: "ai",
    label: "Mock AI Assistant",
    content: <AIAssistantIntegratedMock />,
  },
  {
    id: "coming-soon",
    label: "Próximo módulo",
    content: (
      <div className="p-6 text-center text-slate-700">
        <h2 className="text-xl font-semibold">Próximo módulo</h2>
        <p className="mt-2">En este espacio se agregará más módulos de demo.</p>
      </div>
    ),
  },
];

const getModuleIdFromPath = (pathname: string): string => {
  const cleaned = pathname.replace(/\/+$/, "");
  if (!cleaned.startsWith("/mocks/")) {
    return MODULES[0].id;
  }
  const parts = cleaned.split("/");
  return parts[2] ?? MODULES[0].id;
};

const App = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    getModuleIdFromPath(window.location.pathname),
  );

  const selectedModule = useMemo(
    () =>
      MODULES.find((module) => module.id === selectedModuleId) ?? MODULES[0],
    [selectedModuleId],
  );

  useEffect(() => {
    const onPopState = () =>
      setSelectedModuleId(getModuleIdFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const setRoute = (moduleId: string) => {
    const targetPath = `/mocks/${moduleId}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
    setSelectedModuleId(moduleId);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      <aside className="w-64 border-r border-slate-200 bg-white">
        <div className="px-4 py-4 border-b border-slate-200 font-semibold">
          Módulos
        </div>
        <nav className="p-2">
          {MODULES.map((module) => {
            const active = module.id === selectedModuleId;
            return (
              <button
                key={module.id}
                onClick={() => setRoute(module.id)}
                className={`w-full text-left px-3 py-2 mb-1 rounded ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {module.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 p-4 w-full h-full">{selectedModule.content}</main>
    </div>
  );
};

export default App;
