import type { ReactNode } from "react";
import {
  isRowActionSubmenu,
  resolveSubmenuItems,
  type RowAction,
  type RowActionEntry,
  type RowActionIcon,
  type RowActionLabel,
  type RowActionSubmenu,
} from "./row-action";
import type { ResolvedActionNode, ResolvedSubmenuNode } from "./menu-nodes";

const resolveLabel = <TData,>(label: RowActionLabel<TData>, row: TData) =>
  typeof label === "function" ? label(row) : label;

const resolveIcon = <TData,>(icon: RowActionIcon<TData>, row: TData): ReactNode =>
  typeof icon === "function" ? icon(row) : icon;

export const toActionNode = <TData,>(row: TData, action: RowAction<TData>): ResolvedActionNode => ({
  type: "action",
  key: action.id,
  icon: resolveIcon(action.icon, row),
  label: resolveLabel(action.label, row),
  variant: action.variant,
  disabled: action.disabled?.(row) ?? false,
  onSelect: () => action.onClick(row),
});

// A submenu with no visible action would open an empty panel: it is left out instead.
const toSubmenuNode = <TData,>(row: TData, submenu: RowActionSubmenu<TData>): ResolvedSubmenuNode | null => {
  const children = resolveSubmenuItems(submenu, row)
    .filter((item) => !item.hidden?.(row))
    .map((item) => toActionNode(row, item));
  if (children.length === 0) return null;
  return {
    type: "submenu",
    key: submenu.id,
    icon: resolveIcon(submenu.icon, row),
    label: resolveLabel(submenu.label, row),
    disabled: submenu.disabled?.(row) ?? false,
    children,
  };
};

export const toEntryNode = <TData,>(row: TData, entry: RowActionEntry<TData>) => {
  if (entry.hidden?.(row)) return null;
  return isRowActionSubmenu(entry) ? toSubmenuNode(row, entry) : toActionNode(row, entry);
};
