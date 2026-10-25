import { useId, useState, type CSSProperties, type FormEvent } from "react";
import { MarkdownDialogFrame, MarkdownEditor, type LinkInsert, type MarkdownDialogProps } from "@/components/markdown-editor";
import type { RecordDemoEvent } from "../shared/use-demo-event-log";

const DEMO_PAGES = [
  { label: "Tabla", url: "/mocks/table" },
  { label: "Kanban", url: "/mocks/kanban" },
  { label: "Menú lateral", url: "/mocks/sidebar" },
];

const SAMPLE = "Seleccioná una palabra y tocá **Enlace** (o Ctrl+K): la ventana es de la app y solo devuelve datos.";

const PageOptions = ({ url, onChange }: { url: string; onChange: (url: string) => void }) =>
  DEMO_PAGES.map((page) => (
    <label key={page.url} className="flex items-center gap-2 text-sm">
      <input type="radio" name="demo-page" checked={url === page.url} onChange={() => onChange(page.url)} />
      {page.label} <span className="text-xs text-muted-foreground">{page.url}</span>
    </label>
  ));

const InternalPagesDialog = ({ open, onOpenChange, onInsert, selectedText }: MarkdownDialogProps<LinkInsert>) => {
  const formId = useId();
  const [url, setUrl] = useState(DEMO_PAGES[0].url);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const page = DEMO_PAGES.find((candidate) => candidate.url === url) ?? DEMO_PAGES[0];
    onInsert({ text: selectedText || page.label, url: page.url });
  };
  return (
    <MarkdownDialogFrame open={open} onOpenChange={onOpenChange} title="Enlazar una página de la demo" formId={formId} submitLabel="Enlazar">
      <form id={formId} onSubmit={submit} className="space-y-2">
        <PageOptions url={url} onChange={setUrl} />
      </form>
    </MarkdownDialogFrame>
  );
};

const CUSTOM_DIALOGS = { link: InternalPagesDialog };

const EDITOR_HEIGHT = { "--gdy-md-editor-height": "18rem" } as CSSProperties;

export const CustomDialogExample = ({ record }: { record: RecordDemoEvent }) => (
  <div style={EDITOR_HEIGHT}>
    <MarkdownEditor defaultValue={SAMPLE} dialogs={CUSTOM_DIALOGS} tools="simple" onChange={(value) => record("onChange", { length: value.length })} />
  </div>
);
