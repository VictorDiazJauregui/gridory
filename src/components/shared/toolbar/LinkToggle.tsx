import type { ReactNode } from "react";

interface LinkToggleProps {
  pressed: boolean;
  onClick?: () => void;
  nowrap?: boolean;
  children: ReactNode;
}

const LINK_CLASS_NAME = "gdy-link-btn";
const NOWRAP_LINK_CLASS_NAME = "gdy-link-btn gdy-link-btn-nowrap";

export const LinkToggle = ({
  pressed,
  onClick,
  nowrap,
  children,
}: LinkToggleProps) => (
  <button
    type="button"
    className={nowrap ? NOWRAP_LINK_CLASS_NAME : LINK_CLASS_NAME}
    aria-pressed={pressed}
    onClick={onClick}
  >
    {children}
  </button>
);
