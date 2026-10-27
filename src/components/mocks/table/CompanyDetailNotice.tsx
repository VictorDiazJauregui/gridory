import { X } from "lucide-react";
import { MOCK_COMPANY_ROWS } from "../company/company-rows";
import { useDemoText } from "../shared/demo-dictionary";

interface CompanyDetailNoticeProps {
  detailId: string | null;
  onClose: () => void;
}

export const CompanyDetailNotice = ({ detailId, onClose }: CompanyDetailNoticeProps) => {
  const company = MOCK_COMPANY_ROWS.find((row) => row.id === detailId);
  const translate = useDemoText();
  if (!company) return null;
  return (
    <div role="status" className="mb-3 flex items-center justify-between rounded-md border px-3 py-2 text-sm">
      <span>
        {translate("Detalle de")} <strong>{company.name}</strong> ({company.country})
      </span>
      <button type="button" className="rounded p-1 hover:bg-muted" aria-label={translate("Cerrar el detalle")} onClick={onClose}>
        <X size={14} />
      </button>
    </div>
  );
};
