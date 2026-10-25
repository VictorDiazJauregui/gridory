import type { MockCompanyColumn } from "../company/company-columns";
import type { MockCompanyRow } from "../company/company-rows";

// Long on purpose: the column shows `overflow: "wrap"`, and a short note would never need it.
const describeCompanyNote = (row: MockCompanyRow) =>
  `${row.name} usa ${row.apps.join(", ")} desde ${row.country}; revisar la renovación del contrato con el área comercial antes del cierre del trimestre.`;

export const buildNotesColumn = (): MockCompanyColumn => ({
  id: "notes",
  header: "Notas",
  accessor: describeCompanyNote,
  width: 280,
  overflow: "wrap",
});
