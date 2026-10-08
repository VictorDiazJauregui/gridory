import { defineLanguageFacet, Language, LanguageSupport } from "@codemirror/language";
import { GFM, parser } from "@lezer/markdown";

let markdownLanguage: Language | undefined;

const createMarkdownLanguage = (): Language => {
  const facet = defineLanguageFacet({ commentTokens: { block: { open: "<!--", close: "-->" } } });
  return new Language(facet, parser.configure(GFM), [], "markdown");
};

export const createMarkdownSupport = (): LanguageSupport => {
  markdownLanguage ??= createMarkdownLanguage();
  return new LanguageSupport(markdownLanguage);
};
