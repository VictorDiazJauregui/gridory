import type { ReactNode } from "react";
import type { MarkdownEditorDemoSectionContent } from "./markdown-editor-sections";

interface MarkdownEditorDemoSectionProps {
  section: MarkdownEditorDemoSectionContent;
  children?: ReactNode;
}

export const MarkdownEditorDemoSection = ({ section, children }: MarkdownEditorDemoSectionProps) => {
  const headingId = `markdown-editor-demo-${section.id}-title`;
  return (
    <section aria-labelledby={headingId} className="rounded-lg border bg-card p-4">
      <h3 id={headingId} className="text-base font-semibold">{section.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{section.description}</p>
      {children && <div className="mt-3">{children}</div>}
    </section>
  );
};
