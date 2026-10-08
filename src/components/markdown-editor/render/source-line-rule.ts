import type { StateCore, Token } from "markdown-it";

const isTopLevelBlockStart = (token: Token): boolean =>
  token.level === 0 && token.block && token.nesting !== -1 && token.map !== null;

const markSourceLine = (token: Token): void => {
  const [startLine] = token.map ?? [0];
  token.attrSet("data-source-line", String(startLine + 1));
};

export const markSourceLines = (state: StateCore): void => {
  state.tokens.filter(isTopLevelBlockStart).forEach(markSourceLine);
};
