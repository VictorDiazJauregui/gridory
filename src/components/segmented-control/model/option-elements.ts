// Read from the DOM instead of kept in refs, so the list always matches the
// options React rendered last, whatever was added, removed or reordered.
export const listOptionElements = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(':scope > [role="radio"]'));
