import { cn } from "../../../lib/cn";
import { pickConsumerAttributes } from "../../shared/attributes/consumer-attributes";
import type { KanbanBoardProps } from "../types";

// Written by the board. data-drop-disabled (canDrop) and data-collapsed (collapsible columns) are
// reserved before the board writes them, so no app can start using those names in between.
export const RESERVED_COLUMN_ATTRIBUTES: readonly string[] = [
  "data-drop-target",
  "data-column-value",
  "data-drop-disabled",
  "data-collapsed",
];

export type ColumnHookSettings = Pick<
  KanbanBoardProps<unknown>,
  "classNames" | "getColumnClassName" | "getColumnAttributes"
>;

export const buildColumnHookProps = (value: string, settings: ColumnHookSettings) => ({
  ...pickConsumerAttributes(settings.getColumnAttributes?.(value), RESERVED_COLUMN_ATTRIBUTES),
  className: cn("gdy-kanban-column", settings.classNames?.column, settings.getColumnClassName?.(value)),
  "data-column-value": value,
});
