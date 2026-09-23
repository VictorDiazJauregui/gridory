import { cn } from "../../../lib/cn";
import type { SidebarViewProps } from "../sidebar/use-sidebar-view";

export const AIChatSuggestionChips = ({ view }: SidebarViewProps) => {
  const { chips, classNames, composer } = view;
  if (chips.length === 0) return null;
  return (
    <div className="gdy-ai-chips">
      {chips.map((chip) => (
        <button
          key={chip.label}
          type="button"
          onClick={() => void composer.submit(chip.prompt)}
          className={cn("gdy-ai-chip", classNames?.chip)}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
};
