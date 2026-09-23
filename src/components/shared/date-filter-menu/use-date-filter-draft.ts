import { useState } from "react";
import type { DateFilterState } from "../data-model";

interface DateFilterDraftOptions {
  state: DateFilterState;
  emptyState: DateFilterState;
  onChange: (next: DateFilterState) => void;
  onClose: () => void;
  onSortClear?: () => void;
}

export interface DateFilterDraft {
  tempState: DateFilterState;
  patch: (changes: Partial<DateFilterState>) => void;
  apply: () => void;
  clear: () => void;
}

export const useDateFilterDraft = (
  options: DateFilterDraftOptions,
): DateFilterDraft => {
  const { emptyState, onChange, onClose, onSortClear } = options;
  const [tempState, setTempState] = useState<DateFilterState>(options.state);
  const patch = (changes: Partial<DateFilterState>) =>
    setTempState({ ...tempState, ...changes });
  const apply = () => {
    onChange(tempState);
    onClose();
  };
  const clear = () => {
    setTempState(emptyState);
    onChange(emptyState);
    onSortClear?.();
  };
  return { tempState, patch, apply, clear };
};
