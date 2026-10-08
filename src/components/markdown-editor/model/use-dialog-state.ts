import { useMemo, useState } from "react";

interface OpenDialog {
  id: string;
  selectedText: string;
  /** What had the focus when the dialog opened: the tool button, or the writing area after a shortcut. */
  returnFocusTo: HTMLElement | null;
}

const readFocusedElement = (): HTMLElement | null => (document.activeElement instanceof HTMLElement ? document.activeElement : null);

export const useDialogState = (readSelectedText: () => string) => {
  const [openDialogState, setOpenDialogState] = useState<OpenDialog | null>(null);
  return useMemo(
    () => ({
      activeDialog: openDialogState?.id ?? null,
      dialogSelectedText: openDialogState?.selectedText ?? "",
      dialogReturnFocus: openDialogState?.returnFocusTo ?? null,
      openDialog: (dialogId: string) => setOpenDialogState({ id: dialogId, selectedText: readSelectedText(), returnFocusTo: readFocusedElement() }),
      closeDialog: () => setOpenDialogState(null),
    }),
    [openDialogState, readSelectedText],
  );
};
