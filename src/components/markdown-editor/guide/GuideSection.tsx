import { useMarkdownEditorContext } from "../model/markdown-editor-context";
import { formatShortcut, isApplePlatform } from "../tools/shortcut-keys";
import type { MarkdownTool } from "../tools/tool-types";
import { MarkdownViewer } from "../viewer/MarkdownViewer";
import type { MarkdownGuideSection } from "./guide-types";

const GuideToolChip = ({ tool }: { tool: MarkdownTool }) => (
  <span className="gdy-md-guide-tool">
    <tool.icon aria-hidden className="gdy-md-tool-icon" />
    {tool.label}
    {tool.shortcut && <kbd className="gdy-md-guide-shortcut">{formatShortcut(tool.shortcut, isApplePlatform())}</kbd>}
  </span>
);

const GuideExample = ({ markdown, sectionId }: { markdown: string; sectionId: string }) => {
  const { codeLanguages, diagrams, formulas, texts } = useMarkdownEditorContext("GuideDialog");
  const guideTexts = texts.dialogs.guide;
  return (
    <div className="gdy-md-guide-example">
      <pre className="gdy-md-guide-source" aria-label={guideTexts.typed}>{markdown}</pre>
      <MarkdownViewer value={markdown} aria-label={guideTexts.rendered} codeLanguages={codeLanguages} diagrams={diagrams} formulas={formulas} renderOptions={{ idPrefix: `guide-${sectionId}` }} className="gdy-md-guide-rendered" />
    </div>
  );
};

export const GuideSection = ({ section, tools }: { section: MarkdownGuideSection; tools: readonly MarkdownTool[] }) => {
  const sectionTools = tools.filter((tool) => section.toolIds.includes(tool.id));
  const headingId = `markdown-guide-${section.id}`;
  return (
    <section className="gdy-md-guide-section" aria-labelledby={headingId}>
      <h3 id={headingId} className="gdy-md-guide-title">{section.title}</h3>
      {sectionTools.length > 0 && <p className="gdy-md-guide-tools">{sectionTools.map((tool) => <GuideToolChip key={tool.id} tool={tool} />)}</p>}
      <p className="gdy-md-guide-description">{section.description}</p>
      {section.examples.map((markdown) => <GuideExample key={markdown} markdown={markdown} sectionId={section.id} />)}
    </section>
  );
};
