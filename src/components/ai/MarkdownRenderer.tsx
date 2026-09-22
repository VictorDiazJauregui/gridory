import type { ReactNode } from "react";

function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export function MarkdownRenderer({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <div className="space-y-1 break-words text-sm leading-relaxed">
      {lines.map((line, index) => {
        if (line.startsWith("### ")) {
          return (
            <h3
              key={index}
              className="mb-1 mt-2 text-[13px] font-semibold text-foreground"
            >
              {renderInline(line.slice(4))}
            </h3>
          );
        }

        if (line.startsWith("- ")) {
          return (
            <div key={index} className="flex gap-1.5 pl-3">
              <span className="mt-0.5 shrink-0 text-primary">&#8226;</span>
              <span>{renderInline(line.slice(2))}</span>
            </div>
          );
        }

        if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.*)/);
          if (match) {
            return (
              <div key={index} className="flex gap-1.5 pl-3">
                <span className="mt-px shrink-0 tabular-nums text-xs font-medium text-primary/70">
                  {match[1]}.
                </span>
                <span>{renderInline(match[2])}</span>
              </div>
            );
          }
        }

        if (line.trim() === "") return <div key={index} className="h-1" />;
        return <p key={index}>{renderInline(line)}</p>;
      })}
    </div>
  );
}
