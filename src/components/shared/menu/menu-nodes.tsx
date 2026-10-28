import type { ReactNode } from "react";
import { Archive, ArchiveRestore, Clock3, Pencil, Trash2 } from "lucide-react";
import { toEntryNode } from "./custom-action-nodes";
import {
  BUILT_IN_ROW_ACTION_IDS,
  DuplicateRowActionError,
  assertUniqueRowActionIds,
  collectRowActionIds,
  validateCustomRowActions,
  type RowAction,
  type RowActionEntry,
  type RowActionSubmenu,
} from "./row-action";
import type { DataViewLabels } from "../labels/data-view-labels";

/** Defaults of the built-in actions; each `rowActions.*Label` wins over its key. */
export type RowActionLabels = Pick<
  DataViewLabels,
  "editAction" | "archiveAction" | "unarchiveAction" | "deleteAction" | "historyAction"
>;

export type BuiltInActionId = (typeof BUILT_IN_ROW_ACTION_IDS)[number];

export interface BuiltInMenuRef {
  kind: "builtin";
  id: BuiltInActionId;
}

export interface MenuSeparator {
  kind: "separator";
  id: string;
}

export interface MenuLabel {
  kind: "label";
  id: string;
  label: string;
  className?: string;
}

export type MenuItem<TData> =
  | (RowAction<TData> & { kind?: "action" })
  | (RowActionSubmenu<TData> & { kind?: "submenu" })
  | BuiltInMenuRef
  | MenuSeparator
  | MenuLabel;

interface MenuActionsInput<TData> {
  edit?: boolean;
  archive?: boolean;
  remove?: boolean;
  history?: boolean;
  onEdit?: (row: TData) => void;
  onArchive?: (row: TData) => void;
  onArchiveToggle?: (row: TData) => void;
  onRemove?: (row: TData) => void;
  onHistory?: (row: TData) => void;
  getIsArchived?: (row: TData) => boolean;
  archiveLabel?: string;
  unarchiveLabel?: string;
  deleteLabel?: string;
  editLabel?: string;
  historyLabel?: string;
  customActions?: RowActionEntry<TData>[];
  menuActions?: MenuItem<TData>[];
}

export interface ResolvedActionNode {
  type: "action";
  key: string;
  icon: ReactNode;
  label: string;
  variant?: "default" | "destructive";
  disabled?: boolean;
  /** Second line under the label, linked with `aria-describedby` (why a disabled item is disabled). */
  description?: string;
  onSelect: () => void;
}

/** An entry that opens its actions in a nested panel. */
export interface ResolvedSubmenuNode {
  type: "submenu";
  key: string;
  icon: ReactNode;
  label: string;
  disabled?: boolean;
  children: ResolvedActionNode[];
}

interface ResolvedSeparatorNode {
  type: "separator";
  key: string;
}

interface ResolvedLabelNode {
  type: "label";
  key: string;
  label: string;
  className?: string;
}

export type ResolvedMenuNode =
  | ResolvedActionNode
  | ResolvedSubmenuNode
  | ResolvedSeparatorNode
  | ResolvedLabelNode;

type BuiltInRegistry = Record<BuiltInActionId, ResolvedActionNode | null>;

interface BuiltInNodeInput<TData> {
  row: TData;
  actions: MenuActionsInput<TData>;
  labels: RowActionLabels;
}

const isReservedId = (id: string) =>
  (BUILT_IN_ROW_ACTION_IDS as readonly string[]).includes(id);

const buildEditNode = <TData,>({ row, actions, labels }: BuiltInNodeInput<TData>): ResolvedActionNode | null => {
  if (actions.edit === false || !actions.onEdit) return null;
  return {
    type: "action",
    key: "edit",
    icon: <Pencil />,
    label: actions.editLabel ?? labels.editAction,
    onSelect: () => actions.onEdit?.(row),
  };
};

const buildArchiveNode = <TData,>({ row, actions, labels }: BuiltInNodeInput<TData>): ResolvedActionNode | null => {
  if (actions.archive === false) return null;
  if (!actions.onArchiveToggle && !actions.onArchive) return null;
  const isArchived = actions.getIsArchived?.(row) ?? false;
  return {
    type: "action",
    key: "archive",
    icon: isArchived ? <ArchiveRestore /> : <Archive />,
    label: isArchived
      ? (actions.unarchiveLabel ?? labels.unarchiveAction)
      : (actions.archiveLabel ?? labels.archiveAction),
    onSelect: () =>
      actions.onArchiveToggle
        ? actions.onArchiveToggle(row)
        : actions.onArchive?.(row),
  };
};

const buildRemoveNode = <TData,>({ row, actions, labels }: BuiltInNodeInput<TData>): ResolvedActionNode | null => {
  if (actions.remove === false || !actions.onRemove) return null;
  return {
    type: "action",
    key: "remove",
    icon: <Trash2 />,
    label: actions.deleteLabel ?? labels.deleteAction,
    variant: "destructive",
    onSelect: () => actions.onRemove?.(row),
  };
};

const buildHistoryNode = <TData,>({ row, actions, labels }: BuiltInNodeInput<TData>): ResolvedActionNode | null => {
  if (actions.history === false || !actions.onHistory) return null;
  return {
    type: "action",
    key: "history",
    icon: <Clock3 />,
    label: actions.historyLabel ?? labels.historyAction,
    onSelect: () => actions.onHistory?.(row),
  };
};

const buildBuiltInRegistry = <TData,>(input: BuiltInNodeInput<TData>): BuiltInRegistry => ({
  edit: buildEditNode(input),
  archive: buildArchiveNode(input),
  remove: buildRemoveNode(input),
  history: buildHistoryNode(input),
});

const isPresent = <TNode,>(node: TNode | null): node is TNode => node !== null;

const customToNodes = <TData,>(
  row: TData,
  actions: RowActionEntry<TData>[],
  placement: "top" | "bottom",
): ResolvedMenuNode[] => {
  return actions
    .filter((action) => (action.placement ?? "bottom") === placement)
    .map((action) => toEntryNode(row, action))
    .filter(isPresent);
};

const resolveByPlacement = <TData,>(
  row: TData,
  builtIns: BuiltInRegistry,
  custom: RowActionEntry<TData>[],
): ResolvedMenuNode[] => {
  const middle = BUILT_IN_ROW_ACTION_IDS.map((id) => builtIns[id]).filter(
    (node): node is ResolvedActionNode => node !== null,
  );
  return [
    ...customToNodes(row, custom, "top"),
    ...middle,
    ...customToNodes(row, custom, "bottom"),
  ];
};

const isCustomEntry = <TData,>(
  item: MenuItem<TData>,
): item is MenuItem<TData> & RowActionEntry<TData> => {
  return item.kind === undefined || item.kind === "action" || item.kind === "submenu";
};

const collectMenuItemIds = <TData,>(item: MenuItem<TData>, row: TData) => {
  if (!isCustomEntry(item)) return [item.id];
  const ids = collectRowActionIds(item, row);
  const reservedId = ids.find(isReservedId);
  if (reservedId) throw new DuplicateRowActionError(reservedId);
  return ids;
};

const validateMenuActions = <TData,>(items: MenuItem<TData>[], row: TData): void => {
  const seenIds = new Set<string>();
  items.forEach((item) => assertUniqueRowActionIds(collectMenuItemIds(item, row), seenIds));
};

const itemToNode = <TData,>(
  row: TData,
  builtIns: BuiltInRegistry,
  item: MenuItem<TData>,
): ResolvedMenuNode | null => {
  if (item.kind === "separator") return { type: "separator", key: item.id };
  if (item.kind === "label")
    return {
      type: "label",
      key: item.id,
      label: item.label,
      className: item.className,
    };
  if (item.kind === "builtin") return builtIns[item.id];
  return toEntryNode(row, item);
};

export const resolveMenuNodes = <TData,>(input: BuiltInNodeInput<TData>): ResolvedMenuNode[] => {
  const { row, actions } = input;
  const builtIns = buildBuiltInRegistry(input);
  if (actions.menuActions?.length) {
    validateMenuActions(actions.menuActions, row);
    return actions.menuActions
      .map((item) => itemToNode(row, builtIns, item))
      .filter((node): node is ResolvedMenuNode => node !== null);
  }
  return resolveByPlacement(
    row,
    builtIns,
    validateCustomRowActions(actions.customActions, row),
  );
};
