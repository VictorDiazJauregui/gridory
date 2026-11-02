// An emulation outlives the test that set it, so its helper leaves the undo here and the setup runs every pending
// one after each test, even a failed one: a forgotten undo cannot break the next test.
const pendingUndos = new Map<string, () => Promise<void>>();

export const rememberUndo = (change: string, undo: () => Promise<void>): void => {
  pendingUndos.set(change, undo);
};

export const forgetUndo = (change: string): void => {
  pendingUndos.delete(change);
};

export const undoPageChanges = async (): Promise<void> => {
  const undos = [...pendingUndos.values()];
  pendingUndos.clear();
  await Promise.all(undos.map((undo) => undo()));
};
