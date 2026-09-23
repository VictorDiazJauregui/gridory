import type { LucideIcon } from "lucide-react";

interface PageStepButtonProps {
  icon: LucideIcon;
  disabled: boolean;
  onClick: () => void;
}

export const PageStepButton = ({
  icon: Icon,
  disabled,
  onClick,
}: PageStepButtonProps) => (
  <button
    type="button"
    className="gdy-icon-btn"
    disabled={disabled}
    onClick={onClick}
  >
    <Icon size={16} className="gdy-table-pagination-icon" />
  </button>
);
