import { cn } from "../../../lib/cn";
import type { AuthShellView } from "../model/auth-shell-view";
import { GoogleButton } from "../actions/GoogleButton";
import { AuthCard } from "./AuthCard";
import { AuthFooter } from "../actions/AuthFooter";
import { AuthFormBody } from "./AuthFormBody";

interface AuthShellProps {
  shell: AuthShellView;
}

export const AuthShell = ({ shell }: AuthShellProps) => {
  const { google, classNames } = shell.display;
  return (
    <AuthCard shell={shell}>
      <AuthFormBody shell={shell} />
      {google && (
        <div className={cn("gdy-auth-divider", classNames?.divider)}>{shell.texts.divider}</div>
      )}
      {google && <GoogleButton google={google} shell={shell} />}
      {shell.footer && <AuthFooter footer={shell.footer} classNames={classNames} />}
    </AuthCard>
  );
};
