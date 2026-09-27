import { cn } from "../../../lib/cn";
import { Button } from "../../ui/button";
import type { AuthShellView } from "../model/auth-shell-view";
import type { AuthGoogleConfig } from "../types";
import { GoogleLogo } from "./GoogleLogo";
import { keepFieldFocus } from "./keep-field-focus";

interface GoogleButtonFaceProps {
  google: AuthGoogleConfig;
  shell: AuthShellView;
  disabled: boolean;
  paintOnly: boolean;
}

// With `render`, the app's own Google button sits invisible on top and takes
// the clicks, so this face only paints: hidden from assistive tech and the tab order.
const GoogleButtonFace = ({ google, shell, disabled, paintOnly }: GoogleButtonFaceProps) => (
  <Button
    type="button"
    variant="outline"
    className={cn("gdy-auth-google", shell.display.classNames?.google)}
    disabled={disabled}
    onMouseDown={keepFieldFocus}
    onClick={google.onClick}
    aria-hidden={paintOnly || undefined}
    tabIndex={paintOnly ? -1 : undefined}
  >
    <GoogleLogo />
    {shell.texts.google}
  </Button>
);

interface GoogleButtonProps {
  google: AuthGoogleConfig;
  shell: AuthShellView;
}

export const GoogleButton = ({ google, shell }: GoogleButtonProps) => {
  const overlay = google.render?.();
  const disabled = Boolean(google.disabled || shell.display.submitting);
  return (
    <div className="gdy-auth-google-slot" data-disabled={disabled || undefined}>
      <GoogleButtonFace google={google} shell={shell} disabled={disabled} paintOnly={Boolean(overlay)} />
      {overlay && <div className="gdy-auth-google-overlay">{overlay}</div>}
    </div>
  );
};
