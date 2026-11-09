const applyRange = (range: Range) => {
  const selection = document.getSelection() as Selection;
  selection.removeAllRanges();
  selection.addRange(range);
};

export const selectTextOf = (element: Node) => {
  const range = document.createRange();
  range.selectNodeContents(element);
  applyRange(range);
};

export const collapseSelectionIn = (element: Node) => {
  const range = document.createRange();
  range.setStart(element, 0);
  range.collapse(true);
  applyRange(range);
};

export const selectWhitespaceIn = (element: HTMLElement) => {
  const blank = document.createTextNode("   ");
  element.append(blank);
  selectTextOf(blank);
};

export const clearTextSelection = () => document.getSelection()?.removeAllRanges();
