import type { MarkdownIt, RendererRule } from "markdown-it";
import { readAlertVariant } from "./alert-rule";
import { isExternalUrl } from "./link-policy";
import { readRenderEnvironment } from "./render-environment";

type RendererArguments = Parameters<RendererRule>;

const renderBlockquoteOpen = (parser: MarkdownIt): RendererRule => (...[tokens, index, , environment, renderer]: RendererArguments) => {
  const token = tokens[index];
  const opening = `<blockquote${renderer.renderAttrs(token)}>\n`;
  const variant = readAlertVariant(token);
  if (!variant) return opening;
  const title = parser.utils.escapeHtml(readRenderEnvironment(environment).texts.alertTitles[variant]);
  return `${opening}<p class="gdy-md-alert-title">${title}</p>\n`;
};

const renderLinkOpen: RendererRule = (...[tokens, index, options, environment, renderer]: RendererArguments) => {
  const token = tokens[index];
  const opensNewTab = readRenderEnvironment(environment).openExternalLinksInNewTab;
  if (opensNewTab && isExternalUrl(String(token.attrGet("href") ?? ""))) {
    token.attrSet("target", "_blank");
    token.attrSet("rel", "noopener noreferrer");
  }
  return renderer.renderToken(tokens, index, options);
};

const renderImage = (defaultImage: RendererRule): RendererRule => (...rendererArguments: RendererArguments) => {
  const [tokens, index] = rendererArguments;
  tokens[index].attrSet("loading", "lazy");
  return defaultImage(...rendererArguments);
};

const renderTableOpen: RendererRule = (...[tokens, index, options, , renderer]: RendererArguments) =>
  `<div class="gdy-md-table-scroll">${renderer.renderToken(tokens, index, options)}`;

const renderTableClose: RendererRule = (...[tokens, index, options, , renderer]: RendererArguments) =>
  `${renderer.renderToken(tokens, index, options)}</div>\n`;

const renderFence = (parser: MarkdownIt): RendererRule => (...[tokens, index, , , renderer]: RendererArguments) => {
  const token = tokens[index];
  const [language] = token.info.trim().split(/\s+/);
  if (language) token.attrSet("data-language", language);
  return `<pre${renderer.renderAttrs(token)}><code>${parser.utils.escapeHtml(token.content)}</code></pre>\n`;
};

export const installElementRenderers = (parser: MarkdownIt): void => {
  const rules = parser.renderer.rules;
  const defaultImage = rules.image;
  rules.blockquote_open = renderBlockquoteOpen(parser);
  rules.link_open = renderLinkOpen;
  if (defaultImage) rules.image = renderImage(defaultImage);
  rules.table_open = renderTableOpen;
  rules.table_close = renderTableClose;
  rules.fence = renderFence(parser);
};
