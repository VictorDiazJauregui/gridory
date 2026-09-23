import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Moon, Sun } from "lucide-react";
import { DataTableMock } from "@/components/mocks/DataTable.mock";
import { KanbanBoardMock } from "@/components/mocks/KanbanBoard.mock";
import { AIAssistantIntegratedMock } from "@/components/mocks/AIAssistantIntegrated.mock";

type ModuleItem = {
  id: string;
  label: string;
  content: ReactNode;
};

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "gridory-demo-theme";

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
      <div className="p-6 text-center text-foreground">
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

const isTheme = (value: unknown): value is Theme =>
  value === "light" || value === "dark";

/**
 * `?theme=light|dark` wins (deterministic for automated checks), then the
 * choice stored by the toggle, then light.
 */
const readInitialTheme = (): Theme => {
  const fromQuery = new URLSearchParams(window.location.search).get("theme");
  if (isTheme(fromQuery)) return fromQuery;
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // Storage unavailable (private mode or blocked): fall back to light.
  }
  return "light";
};

const App = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(
    getModuleIdFromPath(window.location.pathname),
  );
  const [theme, setTheme] = useState<Theme>(readInitialTheme);

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

  // The library reads the theme from `.dark` on <html>, exactly as a consumer
  // app would set it; the demo shell follows through its own tokens.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage unavailable: the choice simply is not remembered.
    }
  }, [theme]);

  const setRoute = (moduleId: string) => {
    const targetPath = `/mocks/${moduleId}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, "", targetPath);
    }
    setSelectedModuleId(moduleId);
  };

  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="px-4 py-4 border-b border-border font-semibold">
          Módulos
        </div>
        <nav className="p-2 flex-1">
          {MODULES.map((module) => {
            const active = module.id === selectedModuleId;
            return (
              <button
                key={module.id}
                onClick={() => setRoute(module.id)}
                className={`w-full text-left px-3 py-2 mb-1 rounded ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {module.label}
              </button>
            );
          })}
        </nav>
        <div className="p-2 border-t border-border">
          <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-pressed={isDark}
            data-testid="theme-toggle"
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-foreground hover:bg-muted"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {isDark ? "Tema claro" : "Tema oscuro"}
          </button>
        </div>
      </aside>
      <main className="flex-1 p-4 w-full h-full">{selectedModule.content}</main>
    </div>
  );
};

export default App;
