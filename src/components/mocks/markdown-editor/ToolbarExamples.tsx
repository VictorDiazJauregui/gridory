import type { CSSProperties, ReactNode } from "react";
import { MarkdownEditor, MarkdownEditorProvider, MarkdownPanels, MarkdownToolbar } from "@/components/markdown-editor";
import type { RecordDemoEvent } from "../shared/use-demo-event-log";
import { DEMO_TOOLBAR_ITEMS } from "./demo-custom-tools";

const SAMPLE = "## Barra de herramientas\n\nProbá los botones, el menú **Saludos** y el atajo de la firma.";
const EDITOR_STYLE = { "--gdy-md-editor-height": "16rem" } as CSSProperties;

const Example = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="space-y-2">
    <h4 className="text-xs font-medium text-muted-foreground">{title}</h4>
    {children}
  </div>
);

const FreeToolbarExample = () => (
  <MarkdownEditorProvider defaultValue={SAMPLE} tools={DEMO_TOOLBAR_ITEMS}>
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-center gap-3 border-b bg-muted px-3 py-2">
        <span className="text-sm font-semibold">Nota del cliente</span>
        <MarkdownToolbar className="flex-1" />
      </div>
      <div style={{ height: "14rem" }} className="flex">
        <MarkdownPanels className="flex-1" />
      </div>
    </div>
  </MarkdownEditorProvider>
);

const NarrowFrameExample = () => (
  <Example title="Marco de 480 px: lo que no entra se pliega en ⋯">
    <div style={{ width: 480, maxWidth: "100%" }}>
      <MarkdownEditor defaultValue={SAMPLE} tools={DEMO_TOOLBAR_ITEMS} defaultView="source" />
    </div>
  </Example>
);

export const ToolbarExamples = ({ record }: { record: RecordDemoEvent }) => (
  <div className="grid grid-cols-[minmax(0,1fr)] gap-5" style={EDITOR_STYLE}>
    <Example title="Compartida sobre los dos paneles (con herramientas propias)">
      <MarkdownEditor defaultValue={SAMPLE} tools={DEMO_TOOLBAR_ITEMS} onChange={(value) => record("onChange", { length: value.length })} />
    </Example>
    <Example title="Solo sobre el editor">
      <MarkdownEditor defaultValue={SAMPLE} tools={DEMO_TOOLBAR_ITEMS} toolbarPlacement="source" />
    </Example>
    <Example title="Libre, en una cabecera propia">
      <FreeToolbarExample />
    </Example>
    <Example title="Preset mínimo">
      <MarkdownEditor defaultValue={SAMPLE} tools="minimal" />
    </Example>
    <NarrowFrameExample />
  </div>
);
