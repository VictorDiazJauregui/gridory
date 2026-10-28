import { DATA_VIEW_LABELS } from "../shared/labels/data-view-labels";
import type { DataTableLabels } from "./types";

export const DATA_TABLE_LABELS: DataTableLabels = {
  ...DATA_VIEW_LABELS,
  itemsName: "elementos",
  showing: ({ from, to, total, itemsName }) =>
    total === 0 ? `0 ${itemsName}` : `Mostrando ${from}–${to} de ${total} ${itemsName}`,
  pageSize: "Elementos por página",
  pageOf: (page, count) => `Página ${page} de ${count}`,
  previousPage: "Página anterior",
  nextPage: "Página siguiente",
  inlineSelectPlaceholder: "Seleccionar...",
  groupNone: "Ninguno",
  groupEmptyValue: "Sin valor",
  selectRow: "Seleccionar fila",
  selectPageRows: "Seleccionar las filas de la página",
  selectFilteredRows: "Seleccionar todas las filas filtradas",
  printSelected: "Sí",
  printNotSelected: "No",
  printSelectionHeader: "Seleccionada",
  columnHelp: (header) => `Ayuda sobre ${header}`,
};
