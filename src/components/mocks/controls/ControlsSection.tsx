import type { ReactNode } from "react";
import type { ControlsSectionContent } from "./controls-sections";

interface ControlsSectionProps {
  section: ControlsSectionContent;
  children?: ReactNode;
}

const PendingControl = ({ entryPoint }: { entryPoint: string }) => (
  <div className="mt-3 flex min-h-24 items-center justify-center rounded-gdy-md border border-dashed bg-gdy-muted/40 p-4">
    <p className="text-center text-xs text-gdy-muted-foreground">
      Pendiente: llega con <code>{entryPoint}</code>.
    </p>
  </div>
);

export const ControlsSection = ({ section, children }: ControlsSectionProps) => {
  const headingId = `controls-${section.id}-title`;
  return (
    <section aria-labelledby={headingId} className="rounded-gdy-lg border bg-gdy-card p-4">
      <h3 id={headingId} className="text-base font-semibold">{section.title}</h3>
      <p className="mt-1 text-xs text-gdy-muted-foreground">{section.description}</p>
      {children ? <div className="mt-3">{children}</div> : <PendingControl entryPoint={section.entryPoint} />}
    </section>
  );
};
