import type { RowActions } from "../../table";
import type { MockCompanyRow } from "../company/company-rows";
import { TABLE_ROW_ACTIONS } from "./table-config";

// `?acciones=centro` shows the actions column centered; by default it sits on the right.
const readActionsAlign = () =>
  new URLSearchParams(window.location.search).get("acciones") === "centro" ? "center" : "right";

export const buildActionsColumnProps = (): RowActions<MockCompanyRow> => ({
  ...TABLE_ROW_ACTIONS,
  columnLabel: "Acciones",
  align: readActionsAlign(),
  triggerLabel: "Acciones de la empresa",
});
