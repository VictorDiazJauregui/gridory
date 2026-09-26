import { useRef, useState } from "react";
import type { AuthFieldErrors, AuthFormValues } from "../../auth";
import { SUBMIT_DELAY_MS, TAKEN_EMAIL } from "./auth-demo-config";
import type { AuthDemoEvent, AuthDemoExample, AuthDemoForm } from "./auth-demo-config";

const MAX_EVENTS = 8;

const useAuthEventLog = () => {
  const [events, setEvents] = useState<AuthDemoEvent[]>([]);
  const nextId = useRef(0);
  const record = (type: string, payload?: unknown) => {
    nextId.current += 1;
    const event = { id: nextId.current, type, payload };
    setEvents((current) => [event, ...current].slice(0, MAX_EVENTS));
  };
  return { events, record };
};

// Stands in for a backend: answers after a delay and rejects one email as taken.
const useDemoSubmission = (record: (type: string, payload?: unknown) => void) => {
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
  const { events, record } = useAuthEventLog();
  const submission = useDemoSubmission(record);
  const switchForm = (nextForm: AuthDemoForm) => {
    record("link.onClick", { goTo: nextForm });
    setForm(nextForm);
  };
  return { form, setForm, example, setExample, events, record, switchForm, ...submission };
};

export type AuthDemoState = ReturnType<typeof useAuthDemo>;
