import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

export const createSourceHighlighting = () =>
  syntaxHighlighting(
    HighlightStyle.define([
  { tag: tags.heading, class: "gdy-md-source-heading" },
  { tag: tags.strong, class: "gdy-md-source-strong" },
  { tag: tags.emphasis, class: "gdy-md-source-emphasis" },
  { tag: tags.strikethrough, class: "gdy-md-source-strikethrough" },
  { tag: [tags.link, tags.url], class: "gdy-md-source-link" },
  { tag: tags.monospace, class: "gdy-md-source-code" },
  { tag: tags.quote, class: "gdy-md-source-quote" },
  { tag: [tags.processingInstruction, tags.contentSeparator, tags.labelName], class: "gdy-md-source-mark" },
    ]),
  );
