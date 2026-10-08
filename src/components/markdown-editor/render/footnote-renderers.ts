import type { MarkdownIt, RendererRule } from "markdown-it";
import { readRenderEnvironment } from "./render-environment";

type RendererArguments = Parameters<RendererRule>;

const readFootnoteId = (...rendererArguments: RendererArguments): string => {
  const [tokens, index, , , renderer] = rendererArguments;
  const anchorName = renderer.rules.footnote_anchor_name?.(...rendererArguments) ?? "";
  const subId = (tokens[index].meta as { subId: number }).subId;
  return subId > 0 ? `${anchorName}:${subId}` : anchorName;
};

const renderFootnoteReference: RendererRule = (...rendererArguments: RendererArguments) => {
  const renderer = rendererArguments[4];
  const anchorName = renderer.rules.footnote_anchor_name?.(...rendererArguments) ?? "";
  const caption = renderer.rules.footnote_caption?.(...rendererArguments) ?? "";
  const referenceId = readFootnoteId(...rendererArguments);
  return `<sup class="gdy-md-footnote-ref"><a href="#fn${anchorName}" id="fnref${referenceId}">${caption}</a></sup>`;
};

const renderFootnoteBlockOpen = (parser: MarkdownIt): RendererRule => (...[, , , environment]: RendererArguments) => {
  const label = parser.utils.escapeHtml(readRenderEnvironment(environment).texts.footnotes);
  return `<section class="gdy-md-footnotes" aria-label="${label}">\n<ol>\n`;
};

const renderFootnoteOpen: RendererRule = (...rendererArguments: RendererArguments) =>
  `<li id="fn${readFootnoteId(...rendererArguments)}">`;

const renderFootnoteBackReference = (parser: MarkdownIt): RendererRule => (...rendererArguments: RendererArguments) => {
  const label = parser.utils.escapeHtml(readRenderEnvironment(rendererArguments[3]).texts.backToReference);
  const referenceId = readFootnoteId(...rendererArguments);
  return ` <a href="#fnref${referenceId}" class="gdy-md-footnote-backref" aria-label="${label}">↩︎</a>`;
};

export const installFootnoteRenderers = (parser: MarkdownIt): void => {
  const rules = parser.renderer.rules;
  rules.footnote_ref = renderFootnoteReference;
  rules.footnote_block_open = renderFootnoteBlockOpen(parser);
  rules.footnote_open = renderFootnoteOpen;
  rules.footnote_anchor = renderFootnoteBackReference(parser);
};
