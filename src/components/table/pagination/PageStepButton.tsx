import type { LucideIcon } from "lucide-react";

interface PageStepButtonProps {
  icon: LucideIcon;
  label: string;
  disabled: boolean;
  onClick: () => void;
}

export const PageStepButton = ({
  icon: Icon,
  label,
  disabled,
  onClick,
}: PageStepButtonProps) => (
  <button
    type="button"
    className="gdy-icon-btn"
    aria-label={label}
    disabled={disabled}
    onClick={onClick}
  >
    <Icon size={16} className="gdy-table-pagination-icon" />
  </button>
);
