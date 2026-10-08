import type { MarkdownHeading } from "../render/read-headings";

export interface OutlineNode {
  heading: MarkdownHeading;
  children: OutlineNode[];
}

const findParent = (path: OutlineNode[], level: number): OutlineNode | undefined => {
  while (path.length > 0 && path[path.length - 1].heading.level >= level) path.pop();
  return path[path.length - 1];
};

export const buildOutlineTree = (headings: readonly MarkdownHeading[]): OutlineNode[] => {
  const roots: OutlineNode[] = [];
  const path: OutlineNode[] = [];
  headings.forEach((heading) => {
    const node = { heading, children: [] };
    const parent = findParent(path, heading.level);
    (parent?.children ?? roots).push(node);
    path.push(node);
  });
  return roots;
};

const ACTIVE_LINE_TOLERANCE = 0.5;

export const findActiveHeading = (headings: readonly MarkdownHeading[], topLine: number): MarkdownHeading | undefined =>
  headings.findLast((heading) => heading.line <= topLine + ACTIVE_LINE_TOLERANCE) ?? headings[0];
