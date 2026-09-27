import type { ReactNode } from "react";
import type { SidebarDemoSectionContent } from "./sidebar-sections";

interface SidebarDemoSectionProps {
  section: SidebarDemoSectionContent;
  children: ReactNode;
}

export const SidebarDemoSection = ({ section, children }: SidebarDemoSectionProps) => {
  const headingId = `sidebar-demo-${section.id}-title`;
  return (
    <section aria-labelledby={headingId} className="rounded-lg border bg-card p-4">
      <h3 id={headingId} className="text-base font-semibold">{section.title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{section.description}</p>
      <div className="mt-3">{children}</div>
    </section>
  );
};
