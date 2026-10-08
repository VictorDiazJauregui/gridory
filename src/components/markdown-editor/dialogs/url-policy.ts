import { isSafeUrl } from "../render/link-policy";

const HAS_SCHEME = /^[a-z][a-z0-9+.-]*:/i;
const IS_RELATIVE = /^(?:\/|#|\.\.?\/|\?)/;
const HOST_LIKE = /^[^\s/]+\.[^\s/]+/;

export type UrlProblem = "missing" | "invalid" | "unsafe";

export const normalizeUrl = (input: string): string => {
  const url = input.trim();
  if (HAS_SCHEME.test(url) || IS_RELATIVE.test(url)) return url;
  return HOST_LIKE.test(url) ? `https://${url}` : url;
};

const isWellFormed = (url: string): boolean => {
  if (IS_RELATIVE.test(url)) return !/\s/.test(url);
  if (!URL.canParse(url)) return false;
  return !/^https?:/i.test(url) || HOST_LIKE.test(new URL(url).host);
};

export const findUrlProblem = (input: string): UrlProblem | null => {
  const url = normalizeUrl(input);
  if (url === "") return "missing";
  if (!isSafeUrl(url)) return "unsafe";
  return isWellFormed(url) ? null : "invalid";
};
