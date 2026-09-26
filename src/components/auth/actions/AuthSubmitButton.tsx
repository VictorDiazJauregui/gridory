import { Loader2 } from "lucide-react";
import { cn } from "../../../lib/cn";
import { Button } from "../../ui/button";
import type { AuthShellView } from "../model/auth-shell-view";
import { keepFieldFocus } from "./keep-field-focus";

interface AuthSubmitButtonProps {
  shell: AuthShellView;
}

export const AuthSubmitButton = ({ shell }: AuthSubmitButtonProps) => {
  const { display, texts } = shell;
  return (
    <Button
      type="submit"
      size="lg"
      className={cn("gdy-auth-submit", display.classNames?.submit)}
      disabled={display.submitting}
      onMouseDown={keepFieldFocus}
    >
      {display.submitting && <Loader2 className="gdy-auth-spinner" aria-hidden="true" />}
      {display.submitting ? texts.submitting : texts.submit}
    </Button>
  );
};
