import type { RowActions } from "../../table";
import { toDateString } from "./mockAiConfig";
import type { MockCompanyRow } from "./mockCompanyRows";
import type { MockRowsUpdater } from "./mockRowUpdates";

const buildManualRow = (prefix: string, name: string): MockCompanyRow => ({
  id: `${prefix}-${Date.now()}`,
  name,
  brand: "Boreal",
  country: "Chile",
  apps: ["CRM"],
  status: "Pendiente",
  createdAt: toDateString(new Date()),
});

export const prependManualRow = (
  setRows: MockRowsUpdater,
  prefix: string,
  name: string,
) =>
  setRows((previousRows) => [buildManualRow(prefix, name), ...previousRows]);

const toggleArchived = (row: MockCompanyRow): MockCompanyRow => ({
  ...row,
  status: row.status === "Archivada" ? "Activa" : "Archivada",
});

const toggleArchivedRow = (setRows: MockRowsUpdater, rowId: string) =>
  setRows((previousRows) =>
    previousRows.map((item) =>
      item.id === rowId ? toggleArchived(item) : item,
    ),
  );

const removeRow = (setRows: MockRowsUpdater, rowId: string) =>
  setRows((previousRows) => previousRows.filter((item) => item.id !== rowId));

export const buildAiRowActions = (
  setRows: MockRowsUpdater,
): RowActions<MockCompanyRow> => ({
  onEdit: (row) => window.alert(`onEdit -> ${row.name}`),
  onArchiveToggle: (row) => toggleArchivedRow(setRows, row.id),
  onRemove: (row) => removeRow(setRows, row.id),
  onHistory: (row) => window.alert(`onHistory -> ${row.name}`),
});
