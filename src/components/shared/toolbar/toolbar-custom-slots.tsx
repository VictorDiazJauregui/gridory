import type { ReactNode } from "react";
import { cn } from "../../../lib/cn";
import { BUILT_IN_TOOLBAR_SLOT_IDS, type ToolbarSide } from "./toolbar-layout";

/** Your own content in the toolbar, placed by `id` like any built-in slot. */
export interface ToolbarCustomSlot {
  /** Unique among the built-in slots, `toggleGroups`, `headerSelectors` and other slots. */
  id: string;
  content: ReactNode;
  /** Side when there is no `toolbarLayout`; the slot goes at the end of it. Defaults to `"right"`. */
  position?: ToolbarSide;
  /** Extra class(es) for the `gdy-toolbar-slot` wrapper. */
  className?: string;
}

export class DuplicateToolbarSlotError extends Error {
  constructor(slotId: string) {
    super(
      `Toolbar slot id "${slotId}" is already taken. Reserved ids: ` +
        `${BUILT_IN_TOOLBAR_SLOT_IDS.join(", ")}, plus the ids of toggleGroups, ` +
        "headerSelectors and the other toolbarSlots. Use a unique id.",
    );
    this.name = "DuplicateToolbarSlotError";
  }
}

export const validateToolbarSlots = (
  slots: ToolbarCustomSlot[] | undefined,
  controlIds: string[],
): ToolbarCustomSlot[] => {
  if (!slots?.length) return [];
  const takenIds = new Set([...BUILT_IN_TOOLBAR_SLOT_IDS, ...controlIds]);
  for (const slot of slots) {
    if (takenIds.has(slot.id)) throw new DuplicateToolbarSlotError(slot.id);
    takenIds.add(slot.id);
  }
  return slots;
};

export const renderToolbarSlot = ({ id, content, className }: ToolbarCustomSlot) => (
  <div className={cn("gdy-toolbar-slot", className)} data-slot-id={id}>
    {content}
  </div>
);

export const splitSlotSides = (slots: ToolbarCustomSlot[]) => ({
  left: slots.filter((slot) => slot.position === "left").map((slot) => slot.id),
  right: slots.filter((slot) => slot.position !== "left").map((slot) => slot.id),
});
