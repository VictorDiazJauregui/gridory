/** Same rows in the same order, compared by reference: a recomputed array of the same rows is equal. */
export const isSameRowList = <TData>(left: readonly TData[], right: readonly TData[]) =>
  left.length === right.length && left.every((row, index) => row === right[index]);
