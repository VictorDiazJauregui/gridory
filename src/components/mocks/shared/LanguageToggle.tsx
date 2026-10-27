import { Languages } from "lucide-react";
import { setDemoLanguage, useDemoLanguage } from "./demo-language";

export const LanguageToggle = () => {
  const language = useDemoLanguage();
  const next = language === "es" ? "en" : "es";
  return (
    <button
      type="button"
      aria-pressed={language === "en"}
      aria-label={language === "es" ? "Switch the demo to English" : "Cambiar la demo a español"}
      onClick={() => setDemoLanguage(next)}
      className="inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-xs text-muted-foreground aria-pressed:bg-muted aria-pressed:text-foreground"
    >
      <Languages size={14} />
      {language === "es" ? "ES" : "EN"}
    </button>
  );
};
