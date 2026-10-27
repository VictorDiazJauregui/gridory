/**
 * Texts shared by the table and the kanban: toolbar, row and card actions, value and date filter
 * menus and the date pickers. Each key documents its Spanish default.
 */
export interface DataViewLabels {
  /** Search box placeholder. `"Buscar..."` (table), `"Buscar cards..."` (kanban). */
  searchPlaceholder: string;
  /** Create button. `"Nuevo"`. */
  createButton: string;
  /** Text when no row or card matches. `"No se encontraron resultados"`. */
  emptyMessage: string;
  /** Prefix and accessible name of the group selector. `"Agrupar por"`. */
  groupSelector: string;
  /** Toolbar button that clears every filter. `"Limpiar filtros"`. */
  clearFilters: string;
  /** Prefix and accessible name of the archived view selector. `"Mostrar"`. */
  archivedView: string;
  /** Archived view option for active rows. `"Activos"`. */
  archivedActive: string;
  /** Archived view option for archived rows. `"Archivados"`. */
  archivedArchived: string;
  /** Archived view option for every row. `"Todos"`. */
  archivedAll: string;
  /** View switch button of the table. `"Tabla"`. */
  viewSwitchTable: string;
  /** View switch button of the kanban. `"Kanban"`. */
  viewSwitchKanban: string;
  /** AI button. `"AI"`. */
  aiButton: string;
  /** Tooltip and accessible name of the ⋯ button. `"Opciones"`. */
  rowActionsTrigger: string;
  /** Built-in edit action. `"Editar"`. */
  editAction: string;
  /** Built-in archive action. `"Archivar"`. */
  archiveAction: string;
  /** Built-in unarchive action. `"Desarchivar"`. */
  unarchiveAction: string;
  /** Built-in delete action. `"Eliminar"`. */
  deleteAction: string;
  /** Built-in history action. `"Ver historial"`. */
  historyAction: string;
  /** Sort section title of the filter menus. `"Ordenar"`. */
  sortTitle: string;
  /** Ascending sort of a value column. `"Ascendente (A → Z)"`. */
  sortAscending: string;
  /** Descending sort of a value column. `"Descendente (Z → A)"`. */
  sortDescending: string;
  /** Filter section title of the value menu. `"Filtrar"`. */
  filterTitle: string;
  /** Selects every listed option; `count` is how many are listed. `"Seleccionar todo (n)"`. */
  selectAll: (count: number) => string;
  /** Clears the selection of the value menu. `"Limpiar"`. */
  clearSelection: string;
  /** Search box of the value menu. `"Buscar..."`. */
  filterSearchPlaceholder: string;
  /** Values section title of the value menu. `"Valores"`. */
  valuesTitle: string;
  /** Value menu with no option for the search. `"Sin resultados"`. */
  noResults: string;
  /** Ascending sort of a date column. `"Ascendente (antigua → reciente)"`. */
  dateSortAscending: string;
  /** Descending sort of a date column. `"Descendente (reciente → antigua)"`. */
  dateSortDescending: string;
  /** Operator section title of the date menu. `"Operador"`. */
  operatorTitle: string;
  /** "After" operator. `"Mayor que (fecha posterior)"`. */
  operatorAfter: string;
  /** "Before" operator. `"Menor que (fecha anterior)"`. */
  operatorBefore: string;
  /** "Between" operator. `"Entre (rango)"`. */
  operatorBetween: string;
  /** Dates section title of the date menu. `"Fechas"`. */
  datesTitle: string;
  /** Clears the date filter. `"Limpiar"`. */
  dateClear: string;
  /** Applies the date filter. `"Aplicar"`. */
  dateApply: string;
  /** Accessible name of the calendar button of a single date. `"Seleccionar fecha"`. */
  pickDate: string;
  /** Accessible name of the calendar button of a range. `"Seleccionar rango"`. */
  pickRange: string;
  /**
   * Joins a label and its value: the toolbar selectors ("Agrupar por: Ninguno") and the group
   * tag of a kanban card. `` `${label}: ${value}` ``.
   */
  labeledValue: (label: string, value: string) => string;
}

export type FilterMenuLabels = Pick<
  DataViewLabels,
  | "sortTitle"
  | "sortAscending"
  | "sortDescending"
  | "filterTitle"
  | "selectAll"
  | "clearSelection"
  | "filterSearchPlaceholder"
  | "valuesTitle"
  | "noResults"
>;

export type DateFilterMenuLabels = Pick<
  DataViewLabels,
  | "sortTitle"
  | "dateSortAscending"
  | "dateSortDescending"
  | "operatorTitle"
  | "operatorAfter"
  | "operatorBefore"
  | "operatorBetween"
  | "datesTitle"
  | "dateClear"
  | "dateApply"
  | "pickDate"
  | "pickRange"
>;

export const DATA_VIEW_LABELS: DataViewLabels = {
  searchPlaceholder: "Buscar...",
  createButton: "Nuevo",
  emptyMessage: "No se encontraron resultados",
  groupSelector: "Agrupar por",
  clearFilters: "Limpiar filtros",
  archivedView: "Mostrar",
  archivedActive: "Activos",
  archivedArchived: "Archivados",
  archivedAll: "Todos",
  viewSwitchTable: "Tabla",
  viewSwitchKanban: "Kanban",
  aiButton: "AI",
  rowActionsTrigger: "Opciones",
  editAction: "Editar",
  archiveAction: "Archivar",
  unarchiveAction: "Desarchivar",
  deleteAction: "Eliminar",
  historyAction: "Ver historial",
  sortTitle: "Ordenar",
  sortAscending: "Ascendente (A → Z)",
  sortDescending: "Descendente (Z → A)",
  filterTitle: "Filtrar",
  selectAll: (count) => `Seleccionar todo ${count > 0 ? `(${count})` : ""}`,
  clearSelection: "Limpiar",
  filterSearchPlaceholder: "Buscar...",
  valuesTitle: "Valores",
  noResults: "Sin resultados",
  dateSortAscending: "Ascendente (antigua → reciente)",
  dateSortDescending: "Descendente (reciente → antigua)",
  operatorTitle: "Operador",
  operatorAfter: "Mayor que (fecha posterior)",
  operatorBefore: "Menor que (fecha anterior)",
  operatorBetween: "Entre (rango)",
  datesTitle: "Fechas",
  dateClear: "Limpiar",
  dateApply: "Aplicar",
  pickDate: "Seleccionar fecha",
  pickRange: "Seleccionar rango",
  labeledValue: (label, value) => `${label}: ${value}`,
};
