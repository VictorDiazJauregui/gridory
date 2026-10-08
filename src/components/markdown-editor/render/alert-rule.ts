import type { StateCore, Token } from "markdown-it";
import type { MarkdownAlertVariant } from "../types";

const ALERT_MARKER = /^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][ \t]*(?:\n|$)/i;
const VARIANT_BY_MARKER: Record<string, MarkdownAlertVariant> = {
  NOTE: "info",
  IMPORTANT: "important",
  TIP: "success",
  WARNING: "warning",
  CAUTION: "error",
};

const findAlertMarker = (tokens: Token[], index: number): RegExpExecArray | null => {
  const [opening, paragraph, inline] = tokens.slice(index, index + 3);
  if (opening.type !== "blockquote_open" || paragraph?.type !== "paragraph_open") return null;
  if (inline?.type !== "inline") return null;
  return ALERT_MARKER.exec(inline.content);
};

const removeMarker = (tokens: Token[], index: number, marker: RegExpExecArray): void => {
  const inline = tokens[index + 2];
  inline.content = inline.content.slice(marker[0].length);
  if (inline.content.trim() === "") tokens.splice(index + 1, 3);
};

const markAlert = (tokens: Token[], index: number): void => {
  const marker = findAlertMarker(tokens, index);
  if (!marker) return;
  const variant = VARIANT_BY_MARKER[marker[1].toUpperCase()];
  const blockquote = tokens[index];
  blockquote.meta = { alertVariant: variant };
  blockquote.attrJoin("class", "gdy-md-alert");
  blockquote.attrSet("role", "note");
  blockquote.attrSet("data-variant", variant);
  removeMarker(tokens, index, marker);
};

export const markAlerts = (state: StateCore): void => {
  for (let index = state.tokens.length - 1; index >= 0; index -= 1) markAlert(state.tokens, index);
};

export const readAlertVariant = (token: Token): MarkdownAlertVariant | undefined =>
  (token.meta as { alertVariant?: MarkdownAlertVariant } | null)?.alertVariant;
