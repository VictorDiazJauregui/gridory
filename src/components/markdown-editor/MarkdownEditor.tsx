import { cn } from "../../lib/cn";
import { MARKDOWN_EDITOR_DEFAULTS } from "./constants";
import { MarkdownEditorProvider } from "./MarkdownEditorProvider";
import { MarkdownPanels } from "./MarkdownPanels";
import { useMarkdownEditor, useMarkdownEditorContext } from "./model/markdown-editor-context";
import { MarkdownOutline } from "./outline/MarkdownOutline";
import { MarkdownToolbar } from "./toolbar/MarkdownToolbar";
import type { MarkdownEditorProps, MarkdownToolbarPlacement } from "./types";
import { MarkdownViewSwitch } from "./view/MarkdownViewSwitch";

const EditorHeader = ({ placement }: { placement: MarkdownToolbarPlacement }) => (
  <div className="gdy-md-header">
    {placement === "shared" && <MarkdownToolbar />}
    <MarkdownViewSwitch />
  </div>
);

const FULLSCREEN_FRAME_STYLE = { margin: 0 };

type EditorFrameProps = Pick<MarkdownEditorProps, "syncScroll" | "className"> & { placement: MarkdownToolbarPlacement };

const EditorFrame = ({ syncScroll, className, placement }: EditorFrameProps) => {
  const { views, view, fullscreen, outlineOpen } = useMarkdownEditor();
  const { narrowLayout } = useMarkdownEditorContext("MarkdownEditor");
  const showsHeader = placement === "shared" || views.length > 1 || (narrowLayout && view === "split");
  return (
    <div className={cn("gdy-scope gdy-md-editor", className)} data-toolbar-placement={placement} data-fullscreen={fullscreen || undefined} style={fullscreen ? FULLSCREEN_FRAME_STYLE : undefined}>
      {showsHeader && <EditorHeader placement={placement} />}
      <div className="gdy-md-body">
        {outlineOpen && <MarkdownOutline />}
        <MarkdownPanels syncScroll={syncScroll} sourceHeader={placement === "source" ? <MarkdownToolbar /> : undefined} />
      </div>
    </div>
  );
};

export const MarkdownEditor = ({ syncScroll, toolbarPlacement, className, ...providerProps }: MarkdownEditorProps) => (
  <MarkdownEditorProvider {...providerProps}>
    <EditorFrame syncScroll={syncScroll} className={className} placement={toolbarPlacement ?? MARKDOWN_EDITOR_DEFAULTS.toolbarPlacement} />
  </MarkdownEditorProvider>
);
