const URL_SCHEME = /^([a-z][a-z0-9+.-]*):/i;
const SAFE_SCHEMES = new Set(["http", "https", "mailto", "tel"]);
const SAFE_IMAGE_DATA_URL = /^data:image\/(?:png|gif|jpeg|webp);/i;
const EXTERNAL_URL = /^https?:\/\//i;

export const SAFE_URL_PATTERN =
  /^(?:(?:https?|mailto|tel):|data:image\/(?:png|gif|jpeg|webp);|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;

export const isSafeUrl = (url: string): boolean => {
  const trimmedUrl = url.trim();
  const scheme = URL_SCHEME.exec(trimmedUrl)?.[1].toLowerCase();
  if (!scheme) return true;
  return SAFE_SCHEMES.has(scheme) || SAFE_IMAGE_DATA_URL.test(trimmedUrl);
};

export const isExternalUrl = (url: string): boolean => EXTERNAL_URL.test(url.trim());
