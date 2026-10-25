import type { ReactNode } from "react";
import { DemoEventLog } from "../shared/DemoEventLog";
import { useDemoEventLog, type RecordDemoEvent } from "../shared/use-demo-event-log";
import { MarkdownEditorDemoSection } from "./MarkdownEditorDemoSection";
import {
  MARKDOWN_EDITOR_DEMO_SECTIONS,
  MARKDOWN_EDITOR_EVENT_LOG_DESCRIPTION,
} from "./markdown-editor-sections";
import { RenderingExample } from "./RenderingExample";
import { ViewerExample } from "./ViewerExample";
import { ViewsExample } from "./ViewsExample";
import { CustomDialogExample } from "./CustomDialogExample";
import { DiagramsExample } from "./DiagramsExample";
import { FormulasExample } from "./FormulasExample";
import { GuideExample } from "./GuideExample";
import { CustomTokensExample } from "./CustomTokensExample";
import { ToolbarExamples } from "./ToolbarExamples";
import { ShowcaseExample } from "./ShowcaseExample";

type SectionDemo = (record: RecordDemoEvent) => ReactNode;

const SECTION_DEMOS: Partial<Record<string, SectionDemo>> = {
  showcase: () => <ShowcaseExample />,
  rendering: () => <RenderingExample />,
  viewer: () => <ViewerExample />,
  views: (record) => <ViewsExample record={record} />,
  toolbar: (record) => <ToolbarExamples record={record} />,
  "custom-dialogs": (record) => <CustomDialogExample record={record} />,
  diagrams: () => <DiagramsExample />,
  formulas: () => <FormulasExample />,
  guide: () => <GuideExample />,
  custom: () => <CustomTokensExample />,
};

const MarkdownEditorDemoHeader = () => (
  <div className="rounded-lg border bg-card p-4">
    <h2 className="text-lg font-semibold">Editor Markdown</h2>
    <p className="mt-2 text-xs text-muted-foreground">
      Markdown estándar a la izquierda y su HTML sanitizado a la derecha.
    </p>
  </div>
);

export const MarkdownEditorMock = () => {
  const { events, record } = useDemoEventLog();
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
      <div className="min-w-0 flex-1 space-y-4">
        <MarkdownEditorDemoHeader />
        {MARKDOWN_EDITOR_DEMO_SECTIONS.map((section) => (
          <MarkdownEditorDemoSection key={section.id} section={section}>
            {SECTION_DEMOS[section.id]?.(record)}
          </MarkdownEditorDemoSection>
        ))}
      </div>
      <DemoEventLog
        events={events}
        description={MARKDOWN_EDITOR_EVENT_LOG_DESCRIPTION}
      />
    </div>
  );
};
