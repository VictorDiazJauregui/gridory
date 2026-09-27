import { LoginForm, SignUpForm } from "../../auth";
import { DemoEventLog } from "../shared/DemoEventLog";
import { EXAMPLE_OPTIONS, FORM_OPTIONS, TAKEN_EMAIL } from "./auth-demo-config";
import { AuthDemoToggle } from "./AuthDemoToggle";
import { LOGIN_EXAMPLES, SIGN_UP_EXAMPLES } from "./auth-examples";
import { useAuthDemo } from "./use-auth-demo";
import type { AuthDemoState } from "./use-auth-demo";

const EVENT_LOG_DESCRIPTION = "El formulario no llama a ningún backend: emite eventos.";

const AuthDemoHeader = ({ demo }: { demo: AuthDemoState }) => (
  <div className="rounded-lg border bg-card p-4">
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="text-lg font-semibold">Formularios de autenticación</h2>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        <AuthDemoToggle label="Formulario" options={FORM_OPTIONS} value={demo.form} onChange={demo.setForm} />
        <AuthDemoToggle label="Ejemplo" options={EXAMPLE_OPTIONS} value={demo.example} onChange={demo.setExample} />
      </div>
    </div>
    <p className="mt-2 text-xs text-muted-foreground">
      Prueba el email <code>{TAKEN_EMAIL}</code> para ver un error devuelto por el servidor.
    </p>
  </div>
);

const AuthDemoStage = ({ demo }: { demo: AuthDemoState }) => (
  <div className="flex justify-center rounded-lg border border-dashed bg-muted/40 px-4 py-10">
    {demo.form === "login" ? (
      <LoginForm key={`login-${demo.example}`} {...LOGIN_EXAMPLES[demo.example](demo)} />
    ) : (
      <SignUpForm key={`signup-${demo.example}`} {...SIGN_UP_EXAMPLES[demo.example](demo)} />
    )}
  </div>
);

export const AuthFormsMock = () => {
  const demo = useAuthDemo();
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
      <section className="min-w-0 flex-1 space-y-4">
        <AuthDemoHeader demo={demo} />
        <AuthDemoStage demo={demo} />
      </section>
      <DemoEventLog events={demo.events} description={EVENT_LOG_DESCRIPTION} />
    </div>
  );
};
