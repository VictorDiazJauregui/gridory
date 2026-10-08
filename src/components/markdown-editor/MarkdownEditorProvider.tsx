import { useMemo } from "react";
import { MarkdownDialogHost } from "./dialogs/MarkdownDialogHost";
import { MarkdownEditorContext, type MarkdownEditorContextValue } from "./model/markdown-editor-context";
import { useEditorState } from "./model/use-editor-state";
import { useEditorTexts } from "./model/use-editor-texts";
import { useToolGroups } from "./model/use-tool-groups";
import type { MarkdownEditorProviderProps } from "./types";

export const MarkdownEditorProvider = ({ children, texts, renderOptions, tools, ...stateProps }: MarkdownEditorProviderProps) => {
  const { editorState, dialogState, ...runtime } = useEditorState(stateProps);
  const mergedTexts = useEditorTexts(texts);
  const toolbar = useToolGroups({ tools, texts: mergedTexts.tools, hasDiagrams: Boolean(stateProps.diagrams), hasFormulas: Boolean(stateProps.formulas), hasGuide: stateProps.guide !== false });
  const contextValue = useMemo<MarkdownEditorContextValue>(
    () => ({ ...editorState, ...toolbar, ...dialogState, ...runtime, editorState, texts: mergedTexts, renderOptions }),
    [editorState, toolbar, dialogState, runtime, mergedTexts, renderOptions],
  );
  return (
    <MarkdownEditorContext.Provider value={contextValue}>
      {children}
      <MarkdownDialogHost />
    </MarkdownEditorContext.Provider>
  );
};
