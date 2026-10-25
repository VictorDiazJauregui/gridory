import MarkdownItParser, { type MarkdownIt } from "markdown-it";
import footnotePlugin from "markdown-it-footnote";
import type { MarkdownRenderOptions } from "../types";
import { markAlerts } from "./alert-rule";
import { installElementRenderers } from "./element-renderers";
import { installFootnoteRenderers } from "./footnote-renderers";
import { assignHeadingIds } from "./heading-id-rule";
import { isSafeUrl } from "./link-policy";
import { installMathRules } from "./math-rules";
import { markSourceLines } from "./source-line-rule";
import { markTaskListItems } from "./task-list-rule";

/** Syntax the preview recognizes only when the app set up what draws it. */
export interface MarkdownSyntaxFeatures {
  math?: boolean;
}

type ParserFlags = Required<Pick<MarkdownRenderOptions, "allowHtml" | "breaks" | "typographer"> & MarkdownSyntaxFeatures>;

const parsersByFlags = new Map<string, MarkdownIt>();

const installRules = (parser: MarkdownIt): void => {
  parser.core.ruler.before("inline", "gdy_alerts", markAlerts);
  parser.core.ruler.push("gdy_task_list", markTaskListItems);
  parser.core.ruler.push("gdy_heading_ids", assignHeadingIds);
  parser.core.ruler.push("gdy_source_lines", markSourceLines);
};

const createParser = (flags: ParserFlags): MarkdownIt => {
  const parser = MarkdownItParser({
    html: flags.allowHtml,
    breaks: flags.breaks,
    typographer: flags.typographer,
    linkify: true,
  });
  parser.validateLink = isSafeUrl;
  parser.use(footnotePlugin);
  if (flags.math) installMathRules(parser);
  installRules(parser);
  installElementRenderers(parser);
  installFootnoteRenderers(parser);
  return parser;
};

const readParserFlags = (options: MarkdownRenderOptions, features: MarkdownSyntaxFeatures): ParserFlags => ({
  allowHtml: options.allowHtml ?? false,
  breaks: options.breaks ?? false,
  typographer: options.typographer ?? false,
  math: features.math ?? false,
});

export const readParser = (options: MarkdownRenderOptions, features: MarkdownSyntaxFeatures = {}): MarkdownIt => {
  const flags = readParserFlags(options, features);
  const key = JSON.stringify(flags);
  const parser = parsersByFlags.get(key) ?? createParser(flags);
  parsersByFlags.set(key, parser);
  return parser;
};
