export type ToolbarSide = "left" | "right";

export interface ToolbarLayout {
  left?: string[];
  right?: string[];
}

export const DEFAULT_LEFT_SLOT_IDS = ["search", "clearFilters"] as const;
export const DEFAULT_RIGHT_SLOT_IDS = [
  "archived",
  "group",
  "ai",
  "viewSwitch",
  "create",
] as const;

export interface ToolbarClusterInput {
  layout?: ToolbarLayout;
  isVisible: (id: string) => boolean;
  customLeftIds: string[];
  customRightIds: string[];
}

export interface ToolbarClusters {
  left: string[];
  right: string[];
}

export function resolveToolbarClusters(input: ToolbarClusterInput): ToolbarClusters {
  const { layout, isVisible } = input;
  if (layout) {
    return {
      left: (layout.left ?? []).filter(isVisible),
      right: (layout.right ?? []).filter(isVisible),
    };
  }
  return {
    left: [...DEFAULT_LEFT_SLOT_IDS, ...input.customLeftIds].filter(isVisible),
    right: [...input.customRightIds, ...DEFAULT_RIGHT_SLOT_IDS].filter(isVisible),
  };
}
