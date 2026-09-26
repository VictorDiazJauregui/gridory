import { cn } from "../../../lib/cn";
import { AuthFieldList } from "../fields/AuthFieldList";
import type { AuthShellView } from "../model/auth-shell-view";
import { FORM_ERROR_KEY } from "../validation/standard-schema";
import { AuthSubmitButton } from "../actions/AuthSubmitButton";

interface AuthFormBodyProps {
  shell: AuthShellView;
}

export const AuthFormBody = ({ shell }: AuthFormBodyProps) => {
  const { form, display } = shell;
  const formError = display.error ?? form.errorFor(FORM_ERROR_KEY);
  return (
    <form
      className={cn("gdy-auth-form", display.classNames?.form)}
      noValidate
      aria-busy={display.submitting || undefined}
      onSubmit={form.handleSubmit}
    >
      <AuthFieldList shell={shell} />
      {formError && (
        <div role="alert" className={cn("gdy-auth-alert", display.classNames?.alert)}>
          {formError}
        </div>
      )}
      <AuthSubmitButton shell={shell} />
    </form>
  );
};
