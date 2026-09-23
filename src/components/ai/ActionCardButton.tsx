import type { ReactNode } from "react";
import { Button } from "../ui/button";

interface ActionCardButtonProps {
  variant?: "outline";
  className: string;
  onClick: () => void;
  children: ReactNode;
}

export const ActionCardButton = (props: ActionCardButtonProps) => (
  <Button
    type="button"
    variant={props.variant}
    size="sm"
    className={props.className}
    onClick={props.onClick}
  >
    {props.children}
  </Button>
);
