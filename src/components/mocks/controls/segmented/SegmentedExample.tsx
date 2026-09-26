import type { ReactNode } from "react";

interface SegmentedExampleProps {
  title: string;
  /** Only for examples named by their title through aria-labelledby. */
  titleId?: string;
  children: ReactNode;
}

export const SegmentedExample = ({ title, titleId, children }: SegmentedExampleProps) => (
  <div className="min-w-0 rounded-md border p-4">
    <h4 id={titleId} className="text-xs font-medium text-muted-foreground">{title}</h4>
    <div className="mt-3 flex flex-wrap items-center gap-3">{children}</div>
  </div>
);
