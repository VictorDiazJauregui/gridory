import { Moon, Sun } from "lucide-react";
import { useDemoTheme } from "./use-demo-theme";

export const DemoThemeToggle = () => {
  const { isDark, toggleTheme } = useDemoTheme();
  return (
    <div className="p-2 border-t border-border">
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={isDark}
        data-testid="theme-toggle"
        className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-foreground hover:bg-muted"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {isDark ? "Tema claro" : "Tema oscuro"}
      </button>
    </div>
  );
};
