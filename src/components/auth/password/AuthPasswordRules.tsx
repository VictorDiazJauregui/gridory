import { Check, Circle, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../../lib/cn";
import type { AuthPasswordRuleStatus } from "../types";
import type { AuthShellView, PasswordRulesTexts } from "../model/auth-shell-view";
import { resolveRequirementStatus } from "./password-rules";
import type { PasswordRequirement } from "./password-rules";

const RULE_ICONS: Record<AuthPasswordRuleStatus, LucideIcon> = {
  pending: Circle,
  met: Check,
  unmet: X,
};

interface AuthPasswordRuleProps {
  label: string;
  status: AuthPasswordRuleStatus;
  texts: PasswordRulesTexts;
}

const AuthPasswordRule = ({ label, status, texts }: AuthPasswordRuleProps) => {
  const Icon = RULE_ICONS[status];
  return (
    <li className="gdy-auth-rule" data-status={status}>
      <Icon
        className="gdy-auth-rule-icon"
        role="img"
        aria-label={status === "met" ? texts.ruleMet : texts.ruleUnmet}
      />
      {label}
    </li>
  );
};

interface AuthPasswordRulesProps {
  requirements: PasswordRequirement[];
  texts: PasswordRulesTexts;
  shell: AuthShellView;
}

export const AuthPasswordRules = ({ requirements, texts, shell }: AuthPasswordRulesProps) => {
  const password = String(shell.form.values.password ?? "");
  return (
    <div className={cn("gdy-auth-rules", shell.display.classNames?.passwordRules)}>
      <p className="gdy-auth-rules-title">{texts.passwordRulesTitle}</p>
      <ul className="gdy-auth-rules-list">
        {requirements.map((requirement) => (
          <AuthPasswordRule
            key={requirement.id}
            label={requirement.label}
            status={resolveRequirementStatus(requirement, password, shell.form.revealed)}
            texts={texts}
          />
        ))}
      </ul>
    </div>
  );
};
