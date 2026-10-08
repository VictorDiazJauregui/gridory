import type { MarkdownRenderOptions } from "../types";
import { readParser, type MarkdownSyntaxFeatures } from "./markdown-parser";
import { createRenderEnvironment } from "./render-environment";
import { sanitizeHtml } from "./sanitize-html";

export const renderMarkdownWith = (markdown: string, options: MarkdownRenderOptions, features: MarkdownSyntaxFeatures): string =>
  sanitizeHtml(readParser(options, features).render(markdown, createRenderEnvironment(options)));

export const renderMarkdown = (markdown: string, options: MarkdownRenderOptions = {}): string => renderMarkdownWith(markdown, options, {});
