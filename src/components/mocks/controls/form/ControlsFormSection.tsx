import type { RecordingExampleProps } from "../record-value-change";
import { AccountFormExample } from "./AccountFormExample";
import { SharedDialCodesTable } from "./SharedDialCodesTable";

const HEADING_ID = "controls-form-title";

export const ControlsFormSection = ({ record }: RecordingExampleProps) => (
  <section aria-labelledby={HEADING_ID} className="rounded-gdy-lg border bg-gdy-card p-4">
    <h3 id={HEADING_ID} className="text-base font-semibold">En un formulario</h3>
    <p className="mt-1 text-xs text-gdy-muted-foreground">
      País con &quot;no aplica&quot;, WhatsApp con solo dígitos y pegado inteligente, y el catálogo de países.
    </p>
    <div className="mt-3 grid gap-3 lg:grid-cols-2">
      <AccountFormExample record={record} />
      <SharedDialCodesTable />
    </div>
  </section>
);
