import { Plus } from "lucide-react";

interface ToolbarCreateButtonProps {
  label: string;
  onCreate: () => void;
}

export const ToolbarCreateButton = ({
  label,
  onCreate,
}: ToolbarCreateButtonProps) => (
  <button
    type="button"
    className="gdy-btn gdy-btn-primary gdy-toolbar-create"
    onClick={onCreate}
  >
    <Plus size={14} className="gdy-toolbar-create-icon" />
    {label}
  </button>
);
