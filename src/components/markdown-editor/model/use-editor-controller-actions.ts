import { useMemo, useState } from "react";
import type { MarkdownCommand } from "../commands/command-types";
import type { EditorController } from "./editor-controller";

export const useEditorControllerActions = () => {
  const [controller, attachController] = useState<EditorController | null>(null);
  const actions = useMemo(
    () => ({
      apply: (command: MarkdownCommand) => controller?.apply(command),
      undo: () => controller?.undo(),
      redo: () => controller?.redo(),
      focus: () => controller?.focus(),
      openSearch: () => controller?.openSearch(),
      openReplace: () => controller?.openReplace(),
      openGoToLine: () => controller?.openGoToLine(),
      readSelectedText: () => controller?.readSelectedText() ?? "",
    }),
    [controller],
  );
  return { controller, attachController, actions };
};
