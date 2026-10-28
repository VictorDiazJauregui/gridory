import type { MenuItem, RowActions } from "../../table";
import type { MockCompanyRow } from "../company/company-rows";
import { replaceRow, type MockRowsUpdater } from "../company/row-updates";
import { buildStatusSubmenu } from "../company/status-submenu";
import { TABLE_ROW_ACTIONS } from "./table-config";

// `?acciones=centro` shows the actions column centered; by default it sits on the right.
const readActionsAlign = () =>
  new URLSearchParams(window.location.search).get("acciones") === "centro" ? "center" : "right";

// The submenu (1.3.0) goes after the built-ins it sits next to, before the destructive group.
const withStatusSubmenu = (setRows: MockRowsUpdater): MenuItem<MockCompanyRow>[] => {
  const items = TABLE_ROW_ACTIONS.menuActions ?? [];
  const dangerIndex = items.findIndex((item) => item.id === "sep-danger");
  const submenu = buildStatusSubmenu((row, status) => replaceRow(setRows, { ...row, status }));
  return [...items.slice(0, dangerIndex), submenu, ...items.slice(dangerIndex)];
};

export const buildActionsColumnProps = (setRows: MockRowsUpdater): RowActions<MockCompanyRow> => ({
  ...TABLE_ROW_ACTIONS,
  menuActions: withStatusSubmenu(setRows),
  columnLabel: "Acciones",
  align: readActionsAlign(),
  triggerLabel: "Acciones de la empresa",
});
