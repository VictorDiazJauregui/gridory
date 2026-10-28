import { ArrowRightLeft } from "lucide-react";
import type { RowActionSubmenu } from "../../shared/menu/row-action";
import type { MockCompanyRow } from "./company-rows";

type CompanyStatus = MockCompanyRow["status"];

const STATUSES: CompanyStatus[] = ["Activa", "Pendiente", "Archivada"];

/** "Cambiar estado ▸ …": one entry per status, the current one left out. */
export const buildStatusSubmenu = (
  applyStatus: (row: MockCompanyRow, status: CompanyStatus) => void,
): RowActionSubmenu<MockCompanyRow> => ({
  id: "change-status",
  label: "Cambiar estado",
  icon: <ArrowRightLeft size={16} />,
  items: STATUSES.map((status) => ({
    id: `status-${status}`,
    label: status,
    onClick: (row) => applyStatus(row, status),
    hidden: (row) => row.status === status,
  })),
});
