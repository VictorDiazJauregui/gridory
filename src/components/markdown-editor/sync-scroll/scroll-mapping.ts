export interface SourceBlockPosition {
  line: number;
  top: number;
}

const findBlockIndexByLine = (blocks: SourceBlockPosition[], line: number): number => {
  const index = blocks.findIndex((block) => block.line > line);
  return index === -1 ? blocks.length - 1 : Math.max(index - 1, 0);
};

const findBlockIndexByTop = (blocks: SourceBlockPosition[], top: number): number => {
  const index = blocks.findIndex((block) => block.top > top);
  return index === -1 ? blocks.length - 1 : Math.max(index - 1, 0);
};

const interpolate = (start: number, end: number, ratio: number): number => start + (end - start) * ratio;

const ratioBetween = (value: number, start: number, end: number): number =>
  end > start ? Math.min(Math.max((value - start) / (end - start), 0), 1) : 0;

export const mapLineToOffset = (blocks: SourceBlockPosition[], line: number, contentHeight: number): number => {
  if (blocks.length === 0) return 0;
  const index = findBlockIndexByLine(blocks, line);
  const current = blocks[index];
  const next = blocks[index + 1] ?? { line: current.line + 1, top: contentHeight };
  return interpolate(current.top, next.top, ratioBetween(line, current.line, next.line));
};

export const mapOffsetToLine = (blocks: SourceBlockPosition[], offset: number, contentHeight: number): number => {
  if (blocks.length === 0) return 1;
  const index = findBlockIndexByTop(blocks, offset);
  const current = blocks[index];
  const next = blocks[index + 1] ?? { line: current.line + 1, top: contentHeight };
  return interpolate(current.line, next.line, ratioBetween(offset, current.top, next.top));
};
