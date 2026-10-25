import type { StateCore, Token } from "markdown-it";
import { readRenderEnvironment } from "./render-environment";

const FALLBACK_SLUG = "section";

const toSlug = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");

export const readPlainText = (inline: Token | undefined): string =>
  (inline?.children ?? [])
    .filter((child) => child.type === "text" || child.type === "code_inline")
    .map((child) => child.content)
    .join("");

const reserveUniqueSlug = (usedSlugs: Map<string, number>, slug: string): string => {
  const repetitions = usedSlugs.get(slug) ?? 0;
  usedSlugs.set(slug, repetitions + 1);
  return repetitions === 0 ? slug : `${slug}-${repetitions}`;
};

export const assignHeadingIds = (state: StateCore): void => {
  const usedSlugs = new Map<string, number>();
  const { headingIdPrefix } = readRenderEnvironment(state.env);
  state.tokens.forEach((token, index) => {
    if (token.type !== "heading_open") return;
    const slug = toSlug(readPlainText(state.tokens[index + 1])) || FALLBACK_SLUG;
    token.attrSet("id", `${headingIdPrefix}${reserveUniqueSlug(usedSlugs, slug)}`);
  });
};
