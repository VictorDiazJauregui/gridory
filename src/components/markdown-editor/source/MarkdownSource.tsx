import { useEffect, useRef } from "react";
import { cn } from "../../../lib/cn";
import type { EditorController } from "../model/editor-controller";
import { useMarkdownEditorContext, type MarkdownEditorContextValue } from "../model/markdown-editor-context";
import { uploadDroppedImages } from "../model/upload-dropped-images";
import { useLatestRef } from "../model/use-latest-ref";
import { useCodeMirrorController } from "./use-code-mirror-controller";
import "../styles.css";

export interface MarkdownSourceProps {
  /** Accessible name of the writing area; `texts.sourceLabel` when left out. */
  "aria-label"?: string;
  className?: string;
}

const useSourceListeners = (editor: MarkdownEditorContextValue) =>
  useLatestRef({
    onDocumentChange: editor.changeValue,
    onHistoryChange: editor.changeHistory,
    onShortcut: (event: KeyboardEvent) => editor.runShortcut(event, { editor: editor.editorState }),
    onImageFiles: (files: File[], position: number) => uploadDroppedImages(editor, files, position),
  });

const useAttachedController = (editor: MarkdownEditorContextValue, controller: EditorController | null): void => {
  const { attachController, value } = editor;
  useEffect(() => {
    attachController(controller);
    return () => attachController(null);
  }, [attachController, controller]);
  useEffect(() => controller?.syncValue(value), [controller, value]);
};

export const MarkdownSource = ({ className, "aria-label": label }: MarkdownSourceProps) => {
  const editor = useMarkdownEditorContext("MarkdownSource");
  const containerRef = useRef<HTMLDivElement>(null);
  const listeners = useSourceListeners(editor);
  const controller = useCodeMirrorController(containerRef, {
    initialValue: editor.value,
    label: label ?? editor.texts.sourceLabel,
    placeholderText: editor.texts.placeholder,
    searchTexts: editor.texts.search,
    readListeners: () => listeners.current,
  });
  useAttachedController(editor, controller);
  return <div ref={containerRef} className={cn("gdy-scope gdy-md-source", className)} aria-busy={controller ? undefined : true} />;
};
