import { cn } from "../../../lib/cn";
import { AuthLink } from "../actions/AuthLink";
import type { AuthPasswordAddonView, AuthShellView } from "../model/auth-shell-view";
import { AuthPasswordRules } from "./AuthPasswordRules";
import { addonIdFor } from "../fields/field-attributes";

interface AuthPasswordAddonProps {
  addon: AuthPasswordAddonView;
  shell: AuthShellView;
}

export const AuthPasswordAddon = ({ addon, shell }: AuthPasswordAddonProps) => (
  <div id={addonIdFor(shell.form.idFor("password"))} className="gdy-auth-addon">
    {addon.kind === "forgot" ? (
      <AuthLink link={addon.link} className={cn("gdy-auth-forgot", shell.display.classNames?.link)} />
    ) : (
      <AuthPasswordRules requirements={addon.requirements} texts={addon.texts} shell={shell} />
    )}
  </div>
);
