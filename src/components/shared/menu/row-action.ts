import type { ReactNode } from "react";

export type RowActionPlacement = "top" | "bottom";
export type RowActionVariant = "default" | "destructive";

export type RowActionLabel<TData> = string | ((row: TData) => string);

export type RowActionIcon<TData> = ReactNode | ((row: TData) => ReactNode);

export interface RowAction<TData> {
  id: string;
  label: RowActionLabel<TData>;
  icon?: RowActionIcon<TData>;
  onClick: (row: TData) => void;
  placement?: RowActionPlacement;
  variant?: RowActionVariant;
  disabled?: (row: TData) => boolean;
  hidden?: (row: TData) => boolean;
}

/**
 * Opens one more level of actions instead of running one. It holds plain actions only (one level)
 * and is not rendered when none of its actions is visible.
 */
export interface RowActionSubmenu<TData> {
  id: string;
  label: RowActionLabel<TData>;
  icon?: RowActionIcon<TData>;
  items: RowAction<TData>[] | ((row: TData) => RowAction<TData>[]);
  placement?: RowActionPlacement;
  disabled?: (row: TData) => boolean;
  hidden?: (row: TData) => boolean;
}

export type RowActionEntry<TData> = RowAction<TData> | RowActionSubmenu<TData>;

export const isRowActionSubmenu = <TData>(entry: RowActionEntry<TData>): entry is RowActionSubmenu<TData> =>
  "items" in entry;

export const resolveSubmenuItems = <TData>(submenu: RowActionSubmenu<TData>, row: TData) =>
  typeof submenu.items === "function" ? submenu.items(row) : submenu.items;

export const BUILT_IN_ROW_ACTION_IDS = [
  "edit",
  "archive",
  "remove",
  "history",
] as const;

export class DuplicateRowActionError extends Error {
  constructor(actionId: string) {
    super(
      `Custom row action id "${actionId}" collides with an existing action. ` +
        `Reserved ids: ${BUILT_IN_ROW_ACTION_IDS.join(", ")}. Use a unique id.`,
    );
    this.name = "DuplicateRowActionError";
  }
}

// The ids inside a submenu share one namespace with the rest of the menu.
export const collectRowActionIds = <TData>(entry: RowActionEntry<TData>, row: TData): string[] =>
  isRowActionSubmenu(entry) ? [entry.id, ...resolveSubmenuItems(entry, row).map((item) => item.id)] : [entry.id];

export const assertUniqueRowActionIds = (ids: string[], seenIds: Set<string>) => {
  for (const id of ids) {
    if (seenIds.has(id)) throw new DuplicateRowActionError(id);
    seenIds.add(id);
  }
};

export const validateCustomRowActions = <TData>(
  actions: RowActionEntry<TData>[] | undefined,
  row: TData,
): RowActionEntry<TData>[] => {
  if (!actions?.length) return [];
  const seenIds = new Set<string>(BUILT_IN_ROW_ACTION_IDS);
  actions.forEach((action) => assertUniqueRowActionIds(collectRowActionIds(action, row), seenIds));
  return actions;
};
