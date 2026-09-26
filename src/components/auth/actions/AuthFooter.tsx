import { cn } from "../../../lib/cn";
import type { AuthFooterView } from "../model/auth-shell-view";
import type { AuthFormClassNames } from "../types";
import { AuthLink } from "./AuthLink";

interface AuthFooterProps {
  footer: AuthFooterView;
  classNames?: AuthFormClassNames;
}

export const AuthFooter = ({ footer, classNames }: AuthFooterProps) => (
  <p className={cn("gdy-auth-footer", classNames?.footer)}>
    {footer.prompt} <AuthLink link={footer.link} className={classNames?.link} />
  </p>
);
