// Single source of the attributes every header and data cell of a column carries,
// so the column hooks added later (alignment, overflow) land on th and td together.
export const buildCellAttributes = (columnId: string) => ({
  "data-column-id": columnId,
});
