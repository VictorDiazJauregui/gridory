/* Shared row/card menu module: resolution logic plus its render helper. It is a
   utility module, not a Fast-Refresh component boundary, so the "only export
   components" rule does not apply here. */
/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from "react";
import { Archive, ArchiveRestore, Clock3, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  BUILT_IN_ROW_ACTION_IDS,
  DuplicateRowActionError,
  validateCustomRowActions,
  type RowAction,
} from "./row-action";

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
  | BuiltInMenuRef
  | MenuSeparator
  | MenuLabel;

/** Subset of `RowActions` the menu resolver relies on (both components). */
export interface MenuActionsInput<TData> {
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
  customActions?: RowAction<TData>[];
  menuActions?: MenuItem<TData>[];
}

interface ResolvedActionNode {
  type: "action";
  key: string;
  icon: ReactNode;
  label: string;
  variant?: "default" | "destructive";
  disabled?: boolean;
  onSelect: () => void;
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
  | ResolvedSeparatorNode
  | ResolvedLabelNode;

type BuiltInRegistry = Record<BuiltInActionId, ResolvedActionNode | null>;

const RESERVED_IDS = BUILT_IN_ROW_ACTION_IDS as readonly string[];

function buildEditNode<TData>(
  row: TData,
  actions: MenuActionsInput<TData>,
): ResolvedActionNode | null {
  if (actions.edit === false || !actions.onEdit) return null;
  return {
    type: "action",
    key: "edit",
    icon: <Pencil />,
    label: actions.editLabel ?? "Editar",
    onSelect: () => actions.onEdit?.(row),
  };
}

function buildArchiveNode<TData>(
  row: TData,
  actions: MenuActionsInput<TData>,
): ResolvedActionNode | null {
  if (actions.archive === false) return null;
  if (!actions.onArchiveToggle && !actions.onArchive) return null;
  const isArchived = actions.getIsArchived?.(row) ?? false;
  return {
    type: "action",
    key: "archive",
    icon: isArchived ? <ArchiveRestore /> : <Archive />,
    label: isArchived
      ? (actions.unarchiveLabel ?? "Desarchivar")
      : (actions.archiveLabel ?? "Archivar"),
    onSelect: () =>
      actions.onArchiveToggle
        ? actions.onArchiveToggle(row)
        : actions.onArchive?.(row),
  };
}

function buildRemoveNode<TData>(
  row: TData,
  actions: MenuActionsInput<TData>,
): ResolvedActionNode | null {
  if (actions.remove === false || !actions.onRemove) return null;
  return {
    type: "action",
    key: "remove",
    icon: <Trash2 />,
    label: actions.deleteLabel ?? "Eliminar",
    variant: "destructive",
    onSelect: () => actions.onRemove?.(row),
  };
}

function buildHistoryNode<TData>(
  row: TData,
  actions: MenuActionsInput<TData>,
): ResolvedActionNode | null {
  if (actions.history === false || !actions.onHistory) return null;
  return {
    type: "action",
    key: "history",
    icon: <Clock3 />,
    label: actions.historyLabel ?? "Ver historial",
    onSelect: () => actions.onHistory?.(row),
  };
}

function buildBuiltInRegistry<TData>(
  row: TData,
  actions: MenuActionsInput<TData>,
): BuiltInRegistry {
  return {
    edit: buildEditNode(row, actions),
    archive: buildArchiveNode(row, actions),
    remove: buildRemoveNode(row, actions),
    history: buildHistoryNode(row, actions),
  };
}

function toActionNode<TData>(
  row: TData,
  action: RowAction<TData>,
): ResolvedActionNode {
  return {
    type: "action",
    key: action.id,
    icon: action.icon,
    label: action.label,
    variant: action.variant,
    disabled: action.disabled?.(row) ?? false,
    onSelect: () => action.onClick(row),
  };
}

function customToNodes<TData>(
  row: TData,
  actions: RowAction<TData>[],
  placement: "top" | "bottom",
): ResolvedActionNode[] {
  return actions
    .filter((action) => (action.placement ?? "bottom") === placement)
    .filter((action) => !action.hidden?.(row))
    .map((action) => toActionNode(row, action));
}

function resolveByPlacement<TData>(
  row: TData,
  builtIns: BuiltInRegistry,
  custom: RowAction<TData>[],
): ResolvedMenuNode[] {
  const middle = BUILT_IN_ROW_ACTION_IDS.map((id) => builtIns[id]).filter(
    (node): node is ResolvedActionNode => node !== null,
  );
  return [
    ...customToNodes(row, custom, "top"),
    ...middle,
    ...customToNodes(row, custom, "bottom"),
  ];
}

function isCustomAction<TData>(
  item: MenuItem<TData>,
): item is RowAction<TData> & { kind?: "action" } {
  return item.kind === undefined || item.kind === "action";
}

export function validateMenuActions<TData>(
  items: MenuItem<TData>[],
): void {
  const seenIds = new Set<string>();
  for (const item of items) {
    if (seenIds.has(item.id)) throw new DuplicateRowActionError(item.id);
    if (isCustomAction(item) && RESERVED_IDS.includes(item.id))
      throw new DuplicateRowActionError(item.id);
    seenIds.add(item.id);
  }
}

function itemToNode<TData>(
  row: TData,
  builtIns: BuiltInRegistry,
  item: MenuItem<TData>,
): ResolvedMenuNode | null {
  if (item.kind === "separator") return { type: "separator", key: item.id };
  if (item.kind === "label")
    return {
      type: "label",
      key: item.id,
      label: item.label,
      className: item.className,
    };
  if (item.kind === "builtin") return builtIns[item.id];
  if (item.hidden?.(row)) return null;
  return toActionNode(row, item);
}

export function resolveMenuNodes<TData>(
  row: TData,
  actions: MenuActionsInput<TData>,
): ResolvedMenuNode[] {
  const builtIns = buildBuiltInRegistry(row, actions);
  if (actions.menuActions?.length) {
    validateMenuActions(actions.menuActions);
    return actions.menuActions
      .map((item) => itemToNode(row, builtIns, item))
      .filter((node): node is ResolvedMenuNode => node !== null);
  }
  return resolveByPlacement(
    row,
    builtIns,
    validateCustomRowActions(actions.customActions),
  );
}

const stopEvent = (event: { stopPropagation: () => void }) =>
  event.stopPropagation();

export function renderMenuNodes(nodes: ResolvedMenuNode[]): ReactNode {
  return nodes.map((node) => {
    if (node.type === "separator")
      return <DropdownMenuSeparator key={node.key} />;
    if (node.type === "label")
      return (
        <DropdownMenuLabel key={node.key} className={node.className}>
          {node.label}
        </DropdownMenuLabel>
      );
    return (
      <DropdownMenuItem
        key={node.key}
        variant={node.variant}
        disabled={node.disabled}
        onSelect={node.onSelect}
        onClick={stopEvent}
      >
        {node.icon}
        <span className="gdy-menu-item-label">{node.label}</span>
      </DropdownMenuItem>
    );
  });
}
