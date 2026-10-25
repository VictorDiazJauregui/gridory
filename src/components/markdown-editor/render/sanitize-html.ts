import createPurifier, { type Config, type DOMPurify } from "dompurify";
import { SAFE_URL_PATTERN } from "./link-policy";

export class MarkdownSanitizerUnavailableError extends Error {
  constructor() {
    super("renderMarkdown sanitizes its output with the DOM, so it has to run in the browser.");
    this.name = "MarkdownSanitizerUnavailableError";
  }
}

const SANITIZE_CONFIG: Config = {
  USE_PROFILES: { html: true },
  ADD_ATTR: ["target", "loading"],
  ALLOWED_URI_REGEXP: SAFE_URL_PATTERN,
};

let purifier: DOMPurify | undefined;

const keepNewTabLinksIsolated = (node: Element): void => {
  if (node.getAttribute("target") === "_blank") node.setAttribute("rel", "noopener noreferrer");
};

const buildPurifier = (): DOMPurify => {
  const instance = createPurifier(window);
  instance.addHook("afterSanitizeAttributes", keepNewTabLinksIsolated);
  return instance;
};

const readPurifier = (): DOMPurify => {
  if (typeof window === "undefined") throw new MarkdownSanitizerUnavailableError();
  purifier ??= buildPurifier();
  return purifier;
};

export const sanitizeHtml = (html: string): string => readPurifier().sanitize(html, SANITIZE_CONFIG);
