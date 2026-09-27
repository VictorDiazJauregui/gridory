/** Where the pointer and the focus are, plus how many blocks hold the sidebar open. */
export interface SidebarInteraction {
  pointerInside: boolean;
  focusInside: boolean;
  retainCount: number;
}

export type SidebarInteractionEvent =
  | { type: "pointer"; inside: boolean }
  | { type: "focus"; inside: boolean }
  | { type: "dismiss" }
  | { type: "retain" }
  | { type: "release" };

export const INITIAL_INTERACTION: SidebarInteraction = { pointerInside: false, focusInside: false, retainCount: 0 };

export const reduceInteraction = (state: SidebarInteraction, event: SidebarInteractionEvent): SidebarInteraction => {
  if (event.type === "pointer") return { ...state, pointerInside: event.inside };
  if (event.type === "focus") return { ...state, focusInside: event.inside };
  if (event.type === "dismiss") return { ...state, pointerInside: false, focusInside: false };
  if (event.type === "retain") return { ...state, retainCount: state.retainCount + 1 };
  return { ...state, retainCount: Math.max(0, state.retainCount - 1) };
};

interface ExpansionInput {
  pinned: boolean;
  expandOnHover: boolean;
  interaction: SidebarInteraction;
}

// Pinned wins; without hover expansion, pinned is the only way to expand.
export const resolveExpanded = ({ pinned, expandOnHover, interaction }: ExpansionInput): boolean => {
  if (pinned) return true;
  if (!expandOnHover) return false;
  return interaction.pointerInside || interaction.focusInside || interaction.retainCount > 0;
};
