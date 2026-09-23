import { useState } from "react";
import type { MockCompanyRow } from "./data/mockCompanyRows";
import type { MockRowsUpdater } from "./data/mockRowUpdates";

export interface CreatedRowTemplate {
  idPrefix: string;
  namePrefix: string;
  status: MockCompanyRow["status"];
}

const buildCreatedRow = (
  template: CreatedRowTemplate,
  count: number,
): MockCompanyRow => ({
  id: `${template.idPrefix}-${count}`,
  name: `${template.namePrefix} ${count}`,
  brand: "Boreal",
  country: "Chile",
  apps: ["CRM"],
  status: template.status,
  createdAt: "2026-01-01",
});

export const useMockRowCreator = (
  setRows: MockRowsUpdater,
  template: CreatedRowTemplate,
) => {
  const [, setCreatedCount] = useState(1);
  return () => {
    setCreatedCount((previousCount) => {
      const nextRow = buildCreatedRow(template, previousCount);
      setRows((previousRows) => [nextRow, ...previousRows]);
      return previousCount + 1;
    });
  };
};
