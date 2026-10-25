import { test } from "vitest";
import { MissingMarkdownEditorProviderError, useMarkdownEditor } from "../components/markdown-editor/model/markdown-editor-context";
import { MarkdownSource } from "../components/markdown-editor/source/MarkdownSource";
import { expectRenderError } from "./expect-render-error";

const EditorStateReader = () => {
  useMarkdownEditor();
  return null;
};

test("useMarkdownEditor fails with its own error outside the provider", () => {
  expectRenderError(<EditorStateReader />, MissingMarkdownEditorProviderError);
});

test("MarkdownSource fails with its own error outside the provider", () => {
  expectRenderError(<MarkdownSource />, MissingMarkdownEditorProviderError);
});
