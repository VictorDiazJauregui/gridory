export interface MeasuredBox {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
  height: number;
}

// Rounded to whole pixels so assertions compare layout, not sub-pixel noise.
export const measureBox = (element: Element): MeasuredBox => {
  const { top, right, bottom, left, width, height } = element.getBoundingClientRect();
  return {
    top: Math.round(top),
    right: Math.round(right),
    bottom: Math.round(bottom),
    left: Math.round(left),
    width: Math.round(width),
    height: Math.round(height),
  };
};

export const readStyle = (element: Element, property: string, pseudoElement?: string): string =>
  getComputedStyle(element, pseudoElement).getPropertyValue(property);
