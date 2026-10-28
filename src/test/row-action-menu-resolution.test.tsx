import { expect, test, vi } from "vitest";
import { resolveMenuNodes, type MenuItem, type ResolvedMenuNode } from "../components/shared/menu/menu-nodes";
import { DuplicateRowActionError, type RowAction } from "../components/shared/menu/row-action";
import { DATA_VIEW_LABELS } from "../components/shared/labels/data-view-labels";

interface Deal {
  id: string;
  locked: boolean;
}

type ActionsInput = Parameters<typeof resolveMenuNodes<Deal>>[0]["actions"];

const OPEN_DEAL: Deal = { id: "d1", locked: false };
const LOCKED_DEAL: Deal = { id: "d2", locked: true };

const resolve = (actions: ActionsInput, row: Deal = OPEN_DEAL) =>
  resolveMenuNodes({ row, actions, labels: DATA_VIEW_LABELS });

const summarize = (nodes: ResolvedMenuNode[]) =>
  nodes.map((node) => (node.type === "action" ? `${node.key}:${node.label}:${node.disabled ? "off" : "on"}` : `${node.type}:${node.key}`));

const customAction = (id: string, overrides: Partial<RowAction<Deal>> = {}): RowAction<Deal> => ({
  id,
  label: id.toUpperCase(),
  onClick: vi.fn(),
  ...overrides,
});

const BUILT_IN_HANDLERS: ActionsInput = {
  onEdit: vi.fn(),
  onArchive: vi.fn(),
  onRemove: vi.fn(),
  onHistory: vi.fn(),
};

test("lists only the built-ins that have a handler, in their fixed order", () => {
  expect(summarize(resolve(BUILT_IN_HANDLERS))).toEqual([
    "edit:Editar:on",
    "archive:Archivar:on",
    "remove:Eliminar:on",
    "history:Ver historial:on",
  ]);
  expect(summarize(resolve({ onEdit: vi.fn(), remove: false, onRemove: vi.fn() }))).toEqual(["edit:Editar:on"]);
});

test("places custom actions above or below the built-ins and skips the hidden ones", () => {
  const customActions = [
    customAction("pin", { placement: "top" }),
    customAction("share"),
    customAction("lock", { hidden: (row) => row.locked }),
  ];
  expect(summarize(resolve({ onEdit: vi.fn(), customActions }))).toEqual(["pin:PIN:on", "edit:Editar:on", "share:SHARE:on", "lock:LOCK:on"]);
  expect(summarize(resolve({ customActions }, LOCKED_DEAL))).toEqual(["pin:PIN:on", "share:SHARE:on"]);
});

test("evaluates disabled per row and calls onClick with the row", () => {
  const share = customAction("share", { disabled: (row) => row.locked });
  expect(summarize(resolve({ customActions: [share] }, LOCKED_DEAL))).toEqual(["share:SHARE:off"]);
  const [node] = resolve({ customActions: [share] });
  if (node.type === "action") node.onSelect();
  expect(share.onClick).toHaveBeenCalledWith(OPEN_DEAL);
});

test("shows the unarchive label for archived rows", () => {
  const actions: ActionsInput = { onArchiveToggle: vi.fn(), getIsArchived: () => true, unarchiveLabel: "Restore" };
  expect(summarize(resolve(actions))).toEqual(["archive:Restore:on"]);
});

test("rejects custom ids that repeat or collide with a built-in", () => {
  expect(() => resolve({ customActions: [customAction("edit")] })).toThrow(DuplicateRowActionError);
  expect(() => resolve({ customActions: [customAction("x"), customAction("x")] })).toThrow(DuplicateRowActionError);
});

test("menuActions keeps the given order with separators, labels and built-in references", () => {
  const menuActions: MenuItem<Deal>[] = [
    { kind: "label", id: "title", label: "Deal" },
    customAction("share"),
    { kind: "separator", id: "sep" },
    { kind: "builtin", id: "edit" },
    customAction("lock", { hidden: (row) => row.locked }),
  ];
  expect(summarize(resolve({ onEdit: vi.fn(), menuActions }))).toEqual(["label:title", "share:SHARE:on", "separator:sep", "edit:Editar:on", "lock:LOCK:on"]);
  expect(summarize(resolve({ menuActions }, LOCKED_DEAL))).toEqual(["label:title", "share:SHARE:on", "separator:sep"]);
});

test("menuActions rejects repeated ids and custom actions that use a built-in id", () => {
  const separator: MenuItem<Deal> = { kind: "separator", id: "sep" };
  expect(() => resolve({ menuActions: [separator, separator] })).toThrow(DuplicateRowActionError);
  expect(() => resolve({ menuActions: [customAction("remove")] })).toThrow(DuplicateRowActionError);
});
