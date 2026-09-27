// Read from the DOM instead of kept in a ref: the buttons that hand the focus
// back (the clear button, a chip's remove button) always sit in the same box
// as the combobox, and they disappear once they did their job.
export const focusBoxCombobox = (boxDescendant: HTMLElement): void => {
  boxDescendant.closest(".gdy-country-select")?.querySelector<HTMLElement>('[role="combobox"]')?.focus();
};
