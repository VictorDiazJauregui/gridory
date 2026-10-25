export const countFittingGroups = (groupWidths: number[], availableWidth: number, overflowWidth: number): number => {
  const totalWidth = groupWidths.reduce((sum, width) => sum + width, 0);
  if (totalWidth <= availableWidth) return groupWidths.length;
  let usedWidth = overflowWidth;
  const fitting = groupWidths.findIndex((width) => {
    usedWidth += width;
    return usedWidth > availableWidth;
  });
  return fitting === -1 ? groupWidths.length : fitting;
};

export const readMeasuredWidths = (measureRow: HTMLElement): { groups: number[]; overflow: number } => ({
  groups: [...measureRow.querySelectorAll<HTMLElement>("[data-measure-group]")].map((group) => group.getBoundingClientRect().width),
  overflow: measureRow.querySelector<HTMLElement>("[data-measure-overflow]")?.getBoundingClientRect().width ?? 0,
});
