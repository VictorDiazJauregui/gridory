import type { MarkdownIt, RendererRule, StateBlock, StateCore, StateInline } from "markdown-it";

type BlockRuleArguments = [state: StateBlock, startLine: number, endLine: number, silent: boolean];

const DOLLAR = "$";
const DISPLAY_MARKER = "$$";
const BACKSLASH = "\\";

const isBlank = (character: string | undefined): boolean => character === undefined || /\s/.test(character);

const isDigit = (character: string | undefined): boolean => character !== undefined && /\d/.test(character);

const isValidClosing = (source: string, index: number, marker: string): boolean => {
  if (source[index - 1] === BACKSLASH) return false;
  if (marker === DISPLAY_MARKER) return true;
  return !isBlank(source[index - 1]) && !isDigit(source[index + 1]);
};

const findClosingMarker = (source: string, start: number, marker: string): number => {
  if (marker === DOLLAR && isBlank(source[start])) return -1;
  for (let index = source.indexOf(marker, start + 1); index !== -1; index = source.indexOf(marker, index + 1)) {
    if (isValidClosing(source, index, marker)) return index;
  }
  return -1;
};

/** `$…$` and `$$…$$` as GitHub reads them: "$5 y $10" stays text because a closing `$` cannot follow a space. */
export const parseInlineMath = (state: StateInline, silent: boolean): boolean => {
  if (state.src[state.pos] !== DOLLAR) return false;
  const marker = state.src.startsWith(DISPLAY_MARKER, state.pos) ? DISPLAY_MARKER : DOLLAR;
  const start = state.pos + marker.length;
  const end = findClosingMarker(state.src, start, marker);
  if (end === -1 || end === start) return false;
  if (!silent) {
    const token = state.push("math_inline", "math", 0);
    token.content = state.src.slice(start, end);
    token.markup = marker;
  }
  state.pos = end + marker.length;
  return true;
};

const readLine = (state: StateBlock, line: number): string => state.src.slice(state.bMarks[line] + state.tShift[line], state.eMarks[line]);

const findClosingLine = (state: StateBlock, startLine: number, endLine: number): number => {
  const opening = readLine(state, startLine).slice(DISPLAY_MARKER.length).trim();
  if (opening.length > DISPLAY_MARKER.length && opening.endsWith(DISPLAY_MARKER)) return startLine;
  for (let line = startLine + 1; line < endLine; line += 1) {
    if (readLine(state, line).trim().endsWith(DISPLAY_MARKER)) return line;
  }
  return -1;
};

const readBlockContent = (state: StateBlock, startLine: number, closingLine: number): string => {
  const lines = Array.from({ length: closingLine - startLine + 1 }, (_, offset) => readLine(state, startLine + offset));
  const joined = lines.join("\n").trim();
  return joined.slice(DISPLAY_MARKER.length, -DISPLAY_MARKER.length).trim();
};

export const parseBlockMath = (...[state, startLine, endLine, silent]: BlockRuleArguments): boolean => {
  if (state.sCount[startLine] - state.blkIndent >= 4 || !readLine(state, startLine).startsWith(DISPLAY_MARKER)) return false;
  const closingLine = findClosingLine(state, startLine, endLine);
  if (closingLine === -1) return false;
  if (silent) return true;
  const token = state.push("math_block", "math", 0);
  token.block = true;
  token.content = readBlockContent(state, startLine, closingLine);
  token.markup = DISPLAY_MARKER;
  token.map = [startLine, closingLine + 1];
  state.line = closingLine + 1;
  return true;
};

export const convertMathFences = (state: StateCore): void => {
  state.tokens.filter((token) => token.type === "fence" && token.info.trim() === "math").forEach((token) => (token.type = "math_block"));
};

export const installMathRules = (parser: MarkdownIt): void => {
  parser.inline.ruler.after("escape", "gdy_math_inline", parseInlineMath);
  parser.block.ruler.before("fence", "gdy_math_block", parseBlockMath, { alt: ["paragraph", "reference", "blockquote", "list"] });
  parser.core.ruler.after("block", "gdy_math_fences", convertMathFences);
  const escape = parser.utils.escapeHtml;
  parser.renderer.rules.math_inline = (tokens, index) =>
    `<span class="gdy-md-math" data-math="${tokens[index].markup === DISPLAY_MARKER ? "display" : "inline"}">${escape(tokens[index].content)}</span>`;
  parser.renderer.rules.math_block = (...[tokens, index, , , renderer]: Parameters<RendererRule>) =>
    `<div class="gdy-md-math gdy-md-math-block" data-math="display"${renderer.renderAttrs(tokens[index])}>${escape(tokens[index].content.trim())}</div>\n`;
};
