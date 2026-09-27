import type { ReactNode } from "react";

interface ControlExampleProps {
  title: string;
  /** Only for examples named by their title through aria-labelledby. */
  titleId?: string;
  children: ReactNode;
}

export const ControlExample = ({ title, titleId, children }: ControlExampleProps) => (
  <div className="min-w-0 rounded-md border p-4">
    <h4 id={titleId} className="text-xs font-medium text-muted-foreground">{title}</h4>
    <div className="mt-3 flex flex-wrap items-center gap-3">{children}</div>
  </div>
);
