import { Dialog } from "radix-ui";
import { CountrySelect } from "../../../country-select";
import { PhoneInput } from "../../../phone-input";
import { recordValueChange } from "./record-value-change";
import type { RecordingExampleProps } from "./record-value-change";

const HEADING_ID = "controls-dialog-title";
const DIALOG_TITLE = "Datos de contacto";

// A modal traps the focus and the pointer: the lists open in a portal outside it and must still be usable.
const ContactDialogContent = ({ record }: RecordingExampleProps) => (
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 z-40 bg-black/50" />
    <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(92vw,28rem)] -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-gdy-lg border bg-gdy-card p-6 shadow-lg">
      <Dialog.Title className="text-base font-semibold">{DIALOG_TITLE}</Dialog.Title>
      <Dialog.Description className="text-xs text-gdy-muted-foreground">
        País y teléfono dentro de un modal de Radix.
      </Dialog.Description>
      <CountrySelect onValueChange={recordValueChange(record, `${DIALOG_TITLE}: país`)} />
      <PhoneInput onValueChange={recordValueChange(record, `${DIALOG_TITLE}: teléfono`)} />
      <Dialog.Close className="rounded-gdy-md border px-3 py-1.5 text-sm">Cerrar</Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
);

export const ControlsDialogExample = ({ record }: RecordingExampleProps) => (
  <section aria-labelledby={HEADING_ID} className="rounded-gdy-lg border bg-gdy-card p-4">
    <h3 id={HEADING_ID} className="text-base font-semibold">En un modal</h3>
    <p className="mt-1 text-xs text-gdy-muted-foreground">Para probar las listas dentro de un diálogo modal.</p>
    <Dialog.Root>
      <Dialog.Trigger className="mt-3 rounded-gdy-md border px-3 py-1.5 text-sm">Abrir el modal</Dialog.Trigger>
      <ContactDialogContent record={record} />
    </Dialog.Root>
  </section>
);
