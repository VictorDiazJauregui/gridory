import { cn } from "../../../lib/cn";
import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import type { MarkdownHeading } from "../render/read-headings";
import { buildOutlineTree, findActiveHeading, type OutlineNode } from "./outline-tree";
import { revealHeading } from "./reveal-heading";
import { useDocumentHeadings } from "./use-document-headings";
import { useVisibleTopLine } from "./use-visible-top-line";

export interface MarkdownOutlineProps {
  className?: string;
}

interface OutlineListProps {
  nodes: readonly OutlineNode[];
  activeId?: string;
  onSelect: (heading: MarkdownHeading) => void;
}

const OutlineList = ({ nodes, activeId, onSelect }: OutlineListProps) => (
  <ol className="gdy-md-outline-list">
    {nodes.map(({ heading, children }) => (
      <li key={`${heading.id}-${heading.line}`} className="gdy-md-outline-item">
        <button type="button" className="gdy-md-outline-link" title={heading.text} aria-current={heading.id === activeId ? "location" : undefined} onClick={() => onSelect(heading)}>
          {heading.text}
        </button>
        {children.length > 0 && <OutlineList nodes={children} activeId={activeId} onSelect={onSelect} />}
      </li>
    ))}
  </ol>
);

export const MarkdownOutline = ({ className }: MarkdownOutlineProps) => {
  const { texts, controller, previewPanel } = useMarkdownEditorContext("MarkdownOutline");
  const headings = useDocumentHeadings();
  const activeHeading = findActiveHeading(headings, useVisibleTopLine());
  return (
    <nav className={cn("gdy-md-outline", className)} aria-label={texts.outline.title}>
      <p className="gdy-md-outline-title" aria-hidden>{texts.outline.title}</p>
      {headings.length === 0 ? (
        <p className="gdy-md-outline-empty">{texts.outline.empty}</p>
      ) : (
        <OutlineList nodes={buildOutlineTree(headings)} activeId={activeHeading?.id} onSelect={(heading) => revealHeading(controller, previewPanel, heading)} />
      )}
    </nav>
  );
};
