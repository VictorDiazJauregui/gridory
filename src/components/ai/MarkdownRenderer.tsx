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
}

export const MarkdownRenderer = ({ text }: { text: string }) => {
  const lines = text.split("\n");

  return (
    <div className="gdy-ai-markdown">
      {lines.map((line, index) => {
        if (line.startsWith("### ")) {
          return (
            <h3 key={index} className="gdy-ai-md-heading">
              {renderInline(line.slice(4))}
            </h3>
          );
        }

        if (line.startsWith("- ")) {
          return (
            <div key={index} className="gdy-ai-md-item" data-list="unordered">
              <span className="gdy-ai-md-bullet">&#8226;</span>
              <span className="gdy-ai-md-item-text">
                {renderInline(line.slice(2))}
              </span>
            </div>
          );
        }

        const orderedItem = line.match(/^(\d+)\.\s(.*)/);
        if (orderedItem) {
          return (
            <div key={index} className="gdy-ai-md-item" data-list="ordered">
              <span className="gdy-ai-md-number">{orderedItem[1]}.</span>
              <span className="gdy-ai-md-item-text">
                {renderInline(orderedItem[2])}
              </span>
            </div>
          );
        }

        if (line.trim() === "") {
          return <div key={index} className="gdy-ai-md-gap" />;
        }
        return (
          <p key={index} className="gdy-ai-md-paragraph">
            {renderInline(line)}
          </p>
        );
      })}
    </div>
  );
}
