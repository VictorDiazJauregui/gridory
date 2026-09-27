import { Moon, Sun } from "lucide-react";
import { SidebarItem } from "../sidebar";
import { useDemoTheme } from "./use-demo-theme";

// A custom block of the footer: the sidebar only hosts it.
export const DemoThemeToggle = () => {
  const { isDark, toggleTheme } = useDemoTheme();
  return (
    <SidebarItem
      icon={isDark ? <Sun /> : <Moon />}
      label={isDark ? "Tema claro" : "Tema oscuro"}
      onSelect={toggleTheme}
      aria-pressed={isDark}
      data-testid="theme-toggle"
    />
  );
};
