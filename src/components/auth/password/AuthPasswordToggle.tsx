import { Eye, EyeOff } from "lucide-react";
import { Button } from "../../ui/button";
import { keepFieldFocus } from "../actions/keep-field-focus";
import type { AuthShellTexts } from "../model/auth-shell-view";

interface AuthPasswordToggleProps {
  visible: boolean;
  controls: string;
  texts: Pick<AuthShellTexts, "showPassword" | "hidePassword">;
  onToggle: () => void;
}

// The label stays fixed and aria-pressed carries the state, as a toggle button
// should; the title tooltip tells mouse users what the next click does.
export const AuthPasswordToggle = ({ visible, controls, texts, onToggle }: AuthPasswordToggleProps) => {
  const Icon = visible ? EyeOff : Eye;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      className="gdy-auth-password-toggle"
      aria-label={texts.showPassword}
      aria-pressed={visible}
      aria-controls={controls}
      title={visible ? texts.hidePassword : texts.showPassword}
      onMouseDown={keepFieldFocus}
      onClick={onToggle}
    >
      <Icon className="gdy-auth-password-icon" aria-hidden="true" />
    </Button>
  );
};
