import { useState } from "react";
import type { AuthFieldErrors, AuthFormValues } from "../../auth";
import { useDemoEventLog } from "../shared/use-demo-event-log";
import type { RecordDemoEvent } from "../shared/use-demo-event-log";
import { SUBMIT_DELAY_MS, TAKEN_EMAIL } from "./auth-demo-config";
import type { AuthDemoExample, AuthDemoForm } from "./auth-demo-config";

// Stands in for a backend: answers after a delay and rejects one email as taken.
const useDemoSubmission = (record: RecordDemoEvent) => {
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>();
  const submit = (values: AuthFormValues) => {
    record("onSubmit", values);
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setFieldErrors(values.email === TAKEN_EMAIL ? { email: "Ya existe una cuenta con este email" } : undefined);
    }, SUBMIT_DELAY_MS);
  };
  return { submitting, fieldErrors, submit };
};

export const useAuthDemo = () => {
  const [form, setForm] = useState<AuthDemoForm>("login");
  const [example, setExample] = useState<AuthDemoExample>("complete");
  const { events, record } = useDemoEventLog();
  const submission = useDemoSubmission(record);
  const switchForm = (nextForm: AuthDemoForm) => {
    record("link.onClick", { goTo: nextForm });
    setForm(nextForm);
  };
  return { form, setForm, example, setExample, events, record, switchForm, ...submission };
};

export type AuthDemoState = ReturnType<typeof useAuthDemo>;
