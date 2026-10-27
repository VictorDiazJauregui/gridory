import type { DataTableProps } from "../../table";

const PRINT_MODES: Record<string, DataTableProps<unknown>["printMode"]> = {
  pagina: "page",
  todas: "all",
};

/** `?impresion=pagina` or `?impresion=todas` turns on the table's `printMode` in the demo. */
export const readDemoPrintMode = () => {
  const value = new URLSearchParams(window.location.search).get("impresion");
  return value ? PRINT_MODES[value] : undefined;
};
