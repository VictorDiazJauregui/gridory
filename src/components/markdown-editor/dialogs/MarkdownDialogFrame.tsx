import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import { cn } from "../../../lib/cn";
import { Button } from "../../ui/button";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";

export interface MarkdownDialogFrameProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Id of the form inside `children` that the submit button sends. Without it the dialog has no action buttons, as in pickers that insert on click. */
  formId?: string;
  submitLabel?: string;
  className?: string;
  children: ReactNode;
}

const DialogActions = ({ formId, submitLabel }: { formId: string; submitLabel?: string }) => {
  const { texts } = useMarkdownEditorContext("MarkdownDialogFrame");
  return (
    <div className="gdy-md-dialog-actions">
      <Dialog.Close asChild>
        <Button type="button" variant="outline">{texts.dialogs.cancel}</Button>
      </Dialog.Close>
      <Button type="submit" form={formId}>{submitLabel ?? texts.dialogs.insert}</Button>
    </div>
  );
};

const DialogHeader = ({ title }: { title: string }) => {
  const { texts } = useMarkdownEditorContext("MarkdownDialogFrame");
  return (
    <div className="gdy-md-dialog-header">
      <Dialog.Title className="gdy-md-dialog-title">{title}</Dialog.Title>
      <Dialog.Close className="gdy-md-dialog-close" aria-label={texts.dialogs.close}>
        <X aria-hidden />
      </Dialog.Close>
    </div>
  );
};

export const MarkdownDialogFrame = ({ open, onOpenChange, title, formId, submitLabel, className, children }: MarkdownDialogFrameProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className="gdy-scope gdy-md-dialog-overlay" />
      <Dialog.Content className={cn("gdy-scope gdy-md-dialog", className)} aria-describedby={undefined}>
        <DialogHeader title={title} />
        <div className="gdy-md-dialog-body">{children}</div>
        {formId && <DialogActions formId={formId} submitLabel={submitLabel} />}
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
