import { cn } from "../../../lib/cn";
import type { AuthLinkView } from "../model/auth-shell-view";
import { keepFieldFocus } from "./keep-field-focus";

interface AuthLinkProps {
  link: AuthLinkView;
  className?: string;
}

export const AuthLink = ({ link, className }: AuthLinkProps) => {
  const linkProps = {
    className: cn("gdy-auth-link", className),
    onMouseDown: keepFieldFocus,
    onClick: link.onClick,
  };
  if (link.href) {
    return (
      <a {...linkProps} href={link.href}>
        {link.label}
      </a>
    );
  }
  return (
    <button {...linkProps} type="button">
      {link.label}
    </button>
  );
};
