import { AlertDialog } from "radix-ui";
import { replaceDocument } from "../commands/insert-text";
import { Button } from "../../ui/button";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import { useDeferredCloseAction } from "../model/use-deferred-close-action";
import { MARKDOWN_DIALOG_IDS } from "./dialog-ids";
import type { MarkdownClearDialogTexts } from "../types";

interface ClearDialogContentProps {
  texts: MarkdownClearDialogTexts;
  onConfirm: () => void;
  onCloseAutoFocus: (event: Event) => void;
}

const ClearDialogPortal = ({ texts, onConfirm, onCloseAutoFocus }: ClearDialogContentProps) => (
  <AlertDialog.Portal>
    <AlertDialog.Overlay className="gdy-scope gdy-md-dialog-overlay" />
    <AlertDialog.Content className="gdy-scope gdy-md-dialog gdy-md-confirm-dialog" onCloseAutoFocus={onCloseAutoFocus}>
      <AlertDialog.Title className="gdy-md-dialog-title">{texts.title}</AlertDialog.Title>
      <AlertDialog.Description className="gdy-md-dialog-description">{texts.description}</AlertDialog.Description>
      <div className="gdy-md-dialog-actions">
        <AlertDialog.Cancel asChild>
          <Button variant="outline">{texts.cancel}</Button>
        </AlertDialog.Cancel>
        <AlertDialog.Action asChild>
          <Button variant="destructive" onClick={onConfirm}>{texts.confirm}</Button>
        </AlertDialog.Action>
      </div>
    </AlertDialog.Content>
  </AlertDialog.Portal>
);

export const ClearDialog = () => {
  const { activeDialog, closeDialog, apply, texts } = useMarkdownEditorContext("ClearDialog");
  const deferredAction = useDeferredCloseAction();
  return (
    <AlertDialog.Root open={activeDialog === MARKDOWN_DIALOG_IDS.clear} onOpenChange={(open) => !open && closeDialog()}>
      <ClearDialogPortal
        texts={texts.clearDialog}
        onConfirm={() => deferredAction.runAfterClose(() => apply(replaceDocument))}
        onCloseAutoFocus={deferredAction.onCloseAutoFocus}
      />
    </AlertDialog.Root>
  );
};
