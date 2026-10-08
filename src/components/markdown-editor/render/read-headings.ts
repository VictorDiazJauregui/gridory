import type { Token } from "markdown-it";
import type { MarkdownRenderOptions } from "../types";
import { readPlainText } from "./heading-id-rule";
import { readParser, type MarkdownSyntaxFeatures } from "./markdown-parser";
import { createRenderEnvironment } from "./render-environment";

export interface MarkdownHeading {
  level: number;
  text: string;
  /** The same id the heading has in the preview. */
  id: string;
  /** 1-based source line where the heading starts. */
  line: number;
}

const toHeading = (open: Token, inline: Token | undefined): MarkdownHeading => ({
  level: Number(open.tag.slice(1)),
  text: readPlainText(inline).trim() || (inline?.content ?? ""),
  id: String(open.attrGet("id") ?? ""),
  line: (open.map?.[0] ?? 0) + 1,
});

export const readMarkdownHeadings = (markdown: string, options: MarkdownRenderOptions = {}, features: MarkdownSyntaxFeatures = {}): MarkdownHeading[] => {
  const tokens = readParser(options, features).parse(markdown, createRenderEnvironment(options));
  return tokens.flatMap((token, index) => (token.type === "heading_open" ? [toHeading(token, tokens[index + 1])] : []));
};
