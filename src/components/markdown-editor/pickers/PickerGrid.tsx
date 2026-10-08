import type { ReactNode } from "react";
import { moveFocusInGrid } from "./use-grid-navigation";

export interface PickerOption {
  key: string;
  label: string;
  content: ReactNode;
  onPick: () => void;
}

export const PickerGrid = ({ label, options, className }: { label: string; options: readonly PickerOption[]; className?: string }) => (
  <div role="group" aria-label={label} className={className ?? "gdy-md-picker-grid"} onKeyDown={moveFocusInGrid}>
    {options.map((option) => (
      <button key={option.key} type="button" className="gdy-md-picker-cell" aria-label={option.label} title={option.label} onClick={option.onPick}>
        {option.content}
      </button>
    ))}
  </div>
);
