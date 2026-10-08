import type { LanguageFn } from "highlight.js";

/** A language the code dialog offers and the preview can color. Without `load` it is shown as plain text. */
export interface MarkdownCodeLanguage {
  id: string;
  label: string;
  aliases?: readonly string[];
  load?: () => Promise<{ default: LanguageFn }>;
}

export const PLAIN_TEXT_LANGUAGE_ID = "text";

export const DEFAULT_CODE_LANGUAGES: readonly MarkdownCodeLanguage[] = [
  { id: PLAIN_TEXT_LANGUAGE_ID, label: "Texto plano", aliases: ["plaintext", "txt"] },
  { id: "typescript", label: "TypeScript", aliases: ["ts", "tsx"], load: () => import("highlight.js/lib/languages/typescript") },
  { id: "javascript", label: "JavaScript", aliases: ["js", "jsx", "mjs"], load: () => import("highlight.js/lib/languages/javascript") },
  { id: "json", label: "JSON", load: () => import("highlight.js/lib/languages/json") },
  { id: "bash", label: "Bash", aliases: ["sh", "shell", "zsh"], load: () => import("highlight.js/lib/languages/bash") },
  { id: "python", label: "Python", aliases: ["py"], load: () => import("highlight.js/lib/languages/python") },
  { id: "sql", label: "SQL", load: () => import("highlight.js/lib/languages/sql") },
  { id: "xml", label: "HTML / XML", aliases: ["html", "svg"], load: () => import("highlight.js/lib/languages/xml") },
  { id: "css", label: "CSS", load: () => import("highlight.js/lib/languages/css") },
  { id: "markdown", label: "Markdown", aliases: ["md"], load: () => import("highlight.js/lib/languages/markdown") },
  { id: "yaml", label: "YAML", aliases: ["yml"], load: () => import("highlight.js/lib/languages/yaml") },
  { id: "java", label: "Java", load: () => import("highlight.js/lib/languages/java") },
  { id: "csharp", label: "C#", aliases: ["cs"], load: () => import("highlight.js/lib/languages/csharp") },
  { id: "go", label: "Go", aliases: ["golang"], load: () => import("highlight.js/lib/languages/go") },
  { id: "rust", label: "Rust", aliases: ["rs"], load: () => import("highlight.js/lib/languages/rust") },
  { id: "php", label: "PHP", load: () => import("highlight.js/lib/languages/php") },
  { id: "ruby", label: "Ruby", aliases: ["rb"], load: () => import("highlight.js/lib/languages/ruby") },
  { id: "kotlin", label: "Kotlin", aliases: ["kt"], load: () => import("highlight.js/lib/languages/kotlin") },
  { id: "swift", label: "Swift", load: () => import("highlight.js/lib/languages/swift") },
  { id: "dockerfile", label: "Dockerfile", aliases: ["docker"], load: () => import("highlight.js/lib/languages/dockerfile") },
  { id: "diff", label: "Diff", aliases: ["patch"], load: () => import("highlight.js/lib/languages/diff") },
];

export const findCodeLanguage = (languages: readonly MarkdownCodeLanguage[], name: string): MarkdownCodeLanguage | undefined => {
  const wanted = name.toLowerCase();
  return languages.find((language) => language.id === wanted || language.aliases?.includes(wanted));
};
