export const hasTextSelectionWithin = (element: Element) => {
  const selection = element.ownerDocument.getSelection();
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) return false;
  if (selection.toString().trim() === "") return false;
  return selection.getRangeAt(0).intersectsNode(element);
};
