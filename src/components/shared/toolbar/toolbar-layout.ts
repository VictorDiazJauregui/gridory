export type ToolbarSide = "left" | "right";

export interface ToolbarLayout {
  left?: string[];
  right?: string[];
}

const DEFAULT_LEFT_SLOT_IDS = ["search", "clearFilters"] as const;
const DEFAULT_RIGHT_SLOT_IDS = [
  "archived",
  "group",
  "ai",
  "viewSwitch",
  "create",
] as const;

export const BUILT_IN_TOOLBAR_SLOT_IDS: readonly string[] = [
  ...DEFAULT_LEFT_SLOT_IDS,
  ...DEFAULT_RIGHT_SLOT_IDS,
];

interface ToolbarClusterInput {
  layout?: ToolbarLayout;
  isVisible: (id: string) => boolean;
  customLeftIds: string[];
  customRightIds: string[];
  /** Ids placed at the very end of each side when there is no explicit layout. */
  trailingLeftIds?: string[];
  trailingRightIds?: string[];
}

interface ToolbarClusters {
  left: string[];
  right: string[];
}

export const resolveToolbarClusters = (input: ToolbarClusterInput): ToolbarClusters => {
  const { layout, isVisible } = input;
  if (layout) {
    return {
      left: (layout.left ?? []).filter(isVisible),
      right: (layout.right ?? []).filter(isVisible),
    };
  }
  const { customLeftIds, customRightIds, trailingLeftIds = [], trailingRightIds = [] } = input;
  return {
    left: [...DEFAULT_LEFT_SLOT_IDS, ...customLeftIds, ...trailingLeftIds].filter(isVisible),
    right: [...customRightIds, ...DEFAULT_RIGHT_SLOT_IDS, ...trailingRightIds].filter(isVisible),
  };
}
