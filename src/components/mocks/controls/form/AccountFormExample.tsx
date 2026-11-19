import { useState, type FormEvent } from "react";
import { CountrySelect } from "../../../../country-select";
import { PhoneInput, type PhoneInputValue } from "../../../../phone-input";
import type { RecordingExampleProps } from "../record-value-change";
import {
  ACCOUNT_COUNTRY_ID,
  ACCOUNT_WHATSAPP_NAME,
  focusFirstError,
  validateAccountForm,
  type AccountCountry,
  type AccountFormErrors,
} from "./account-form-validation";

const EMPTY_WHATSAPP: PhoneInputValue = { country: null, number: "" };

const useAccountForm = ({ record }: RecordingExampleProps) => {
  const [country, setCountry] = useState<AccountCountry>(null);
  const [whatsapp, setWhatsapp] = useState(EMPTY_WHATSAPP);
  const [errors, setErrors] = useState<AccountFormErrors>({});
  const [saving, setSaving] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateAccountForm(country, whatsapp);
    setErrors(nextErrors);
    focusFirstError(event.currentTarget, nextErrors);
    record("submit", { country, whatsapp });
  };
  return { country, setCountry, whatsapp, setWhatsapp, errors, saving, setSaving, submit };
};

const AccountFields = ({ form }: { form: ReturnType<typeof useAccountForm> }) => (
  <>
    <CountrySelect
      id={ACCOUNT_COUNTRY_ID} name="country" label="País de residencia" required notApplicableOption notApplicableValue="none"
      value={form.country} onValueChange={form.setCountry} disabled={form.saving} error={form.errors.country}
    />
    <PhoneInput
      name={ACCOUNT_WHATSAPP_NAME} label="WhatsApp" numberCharacters="digits" maxNumberLength={9} splitPastedDialCode
      value={form.whatsapp} onValueChange={form.setWhatsapp} disabled={form.saving} error={form.errors.whatsapp}
    />
  </>
);

// One form for the new props: "no aplica", digits only with a maximum, the smart paste, disabled while saving
// and the focus on the first error.
export const AccountFormExample = (props: RecordingExampleProps) => {
  const form = useAccountForm(props);
  return (
    <form aria-label="Alta de cuenta" noValidate onSubmit={form.submit} className="min-w-0 space-y-3 rounded-gdy-md border p-4">
      <h4 className="text-xs font-medium text-gdy-muted-foreground">Alta de cuenta</h4>
      <AccountFields form={form} />
      <p className="text-xs text-gdy-muted-foreground">Valor actual: {form.country ?? "ninguno"} · {form.whatsapp.country ?? "sin país"} {form.whatsapp.number || "sin número"}</p>
      <div className="flex flex-wrap gap-2">
        <button type="submit" className="rounded-gdy-md border px-3 py-1.5 text-sm">Ir al primer error</button>
        <button type="button" className="rounded-gdy-md border px-3 py-1.5 text-sm" onClick={() => form.setSaving(!form.saving)}>
          {form.saving ? "Terminar guardado" : "Simular guardado"}
        </button>
      </div>
    </form>
  );
};
