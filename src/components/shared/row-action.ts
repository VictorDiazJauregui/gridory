import type { ReactNode } from "react";

export type ReusableRowActionPlacement = "top" | "bottom";
export type ReusableRowActionVariant = "default" | "destructive";

export interface ReusableRowAction<TData> {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: (row: TData) => void;
  placement?: ReusableRowActionPlacement;
  variant?: ReusableRowActionVariant;
  disabled?: (row: TData) => boolean;
  hidden?: (row: TData) => boolean;
}

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

export function validateCustomRowActions<TData>(
  actions: ReusableRowAction<TData>[] | undefined,
): ReusableRowAction<TData>[] {
  if (!actions?.length) return [];
  const seenIds = new Set<string>(BUILT_IN_ROW_ACTION_IDS);
  for (const action of actions) {
    if (seenIds.has(action.id)) throw new DuplicateRowActionError(action.id);
    seenIds.add(action.id);
  }
  return actions;
}
