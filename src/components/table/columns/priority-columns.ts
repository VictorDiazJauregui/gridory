/** A column on screen, in screen order, as the priority calculation sees it. */
export interface PriorityColumn {
  id: string;
  width: number;
  /** `false` for the internal columns and the ones the app pins with `columnVisibility: true`. */
  hideable: boolean;
  priority?: number;
}

interface HidingCandidate {
  column: PriorityColumn;
  position: number;
}

// Unnumbered hideable columns go first, right to left; then by number, the rightmost first on a tie.
const compareHidingOrder = (first: HidingCandidate, second: HidingCandidate) => {
  const firstPriority = first.column.priority ?? Number.NEGATIVE_INFINITY;
  const secondPriority = second.column.priority ?? Number.NEGATIVE_INFINITY;
  if (firstPriority !== secondPriority) return firstPriority - secondPriority;
  return second.position - first.position;
};

const listHidingOrder = (columns: PriorityColumn[]) =>
  columns
    .map((column, position) => ({ column, position }))
    .filter(({ column }) => column.hideable)
    .sort(compareHidingOrder)
    .map(({ column }) => column);

/** Ids to hide, in hiding order, until the remaining widths fit in `availableWidth`. */
export const resolvePriorityHiddenColumns = (columns: PriorityColumn[], availableWidth: number) => {
  let totalWidth = columns.reduce((sum, column) => sum + column.width, 0);
  const hiddenIds: string[] = [];
  for (const column of listHidingOrder(columns)) {
    if (totalWidth <= availableWidth) break;
    hiddenIds.push(column.id);
    totalWidth -= column.width;
  }
  return hiddenIds;
};

export const isSameIdList = (first: readonly string[], second: readonly string[]) =>
  first.length === second.length && first.every((id, index) => id === second[index]);
