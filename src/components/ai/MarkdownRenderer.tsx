import type { ReactNode } from "react";

const renderInline = (text: string): ReactNode[] => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="gdy-ai-md-strong">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return (
      <span key={index} className="gdy-ai-md-text">
        {part}
      </span>
    );
  });
};

const renderHeading = (line: string, index: number) => (
  <h3 key={index} className="gdy-ai-md-heading">
    {renderInline(line.slice(4))}
  </h3>
);

const renderBulletItem = (line: string, index: number) => (
  <div key={index} className="gdy-ai-md-item" data-list="unordered">
    <span className="gdy-ai-md-bullet">&#8226;</span>
    <span className="gdy-ai-md-item-text">{renderInline(line.slice(2))}</span>
  </div>
);

const renderNumberedItem = (orderedItem: RegExpMatchArray, index: number) => (
  <div key={index} className="gdy-ai-md-item" data-list="ordered">
    <span className="gdy-ai-md-number">{orderedItem[1]}.</span>
    <span className="gdy-ai-md-item-text">{renderInline(orderedItem[2])}</span>
  </div>
);

const renderParagraph = (line: string, index: number) => (
  <p key={index} className="gdy-ai-md-paragraph">
    {renderInline(line)}
  </p>
);

const renderMarkdownLine = (line: string, index: number): ReactNode => {
  if (line.startsWith("### ")) return renderHeading(line, index);
  if (line.startsWith("- ")) return renderBulletItem(line, index);
  const orderedItem = line.match(/^(\d+)\.\s(.*)/);
  if (orderedItem) return renderNumberedItem(orderedItem, index);
  if (line.trim() === "") return <div key={index} className="gdy-ai-md-gap" />;
  return renderParagraph(line, index);
};

export const MarkdownRenderer = ({ text }: { text: string }) => (
  <div className="gdy-ai-markdown">
    {text.split("\n").map(renderMarkdownLine)}
  </div>
);
