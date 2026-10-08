import { useMemo, useState } from "react";
import { MarkdownEditor } from "@/components/markdown-editor";
import type { RecordDemoEvent } from "../shared/use-demo-event-log";
import { createDemoImageUpload } from "./demo-image-upload";
import { LONG_DOCUMENT_SAMPLE } from "./markdown-samples";

const RENDER_OPTIONS = { idPrefix: "views" };

const DemoToggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) => (
  <label className="flex items-center gap-2 text-xs">
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    {label}
  </label>
);

const createEditorEvents = (record: RecordDemoEvent) => ({
  onViewChange: (view: string) => record("onViewChange", { view }),
  onFullscreenChange: (fullscreen: boolean) => record("onFullscreenChange", { fullscreen }),
  onEmojiSelect: (emoji: string) => record("onEmojiSelect", { emoji }),
  onChange: (value: string) => record("onChange", { length: value.length }),
});

export const ViewsExample = ({ record }: { record: RecordDemoEvent }) => {
  const [syncScroll, setSyncScroll] = useState(true);
  const [uploadFails, setUploadFails] = useState(false);
  const onImageUpload = useMemo(() => createDemoImageUpload(() => uploadFails), [uploadFails]);
  return (
    <div className="space-y-3">
      <DemoToggle label="Scroll sincronizado" checked={syncScroll} onChange={setSyncScroll} />
      <DemoToggle label="Simular que la subida de imágenes falla (la subida tarda 1,2 s)" checked={uploadFails} onChange={setUploadFails} />
      <MarkdownEditor
        defaultValue={LONG_DOCUMENT_SAMPLE}
        syncScroll={syncScroll}
        onImageUpload={onImageUpload}
        renderOptions={RENDER_OPTIONS}
        {...createEditorEvents(record)}
      />
    </div>
  );
};
