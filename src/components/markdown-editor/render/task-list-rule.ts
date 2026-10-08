import type { StateCore, Token } from "markdown-it";

const TASK_MARKER = /^\[([ xX])\][ \t]+/;

const isListItemParagraph = (tokens: Token[], index: number): boolean =>
  tokens[index].type === "inline" &&
  tokens[index - 1]?.type === "paragraph_open" &&
  tokens[index - 2]?.type === "list_item_open";

const createCheckbox = (state: StateCore, checked: boolean): Token => {
  const checkbox = new state.Token("html_inline", "", 0);
  const checkedAttribute = checked ? " checked" : "";
  checkbox.content = `<input type="checkbox" class="gdy-md-task-checkbox" disabled${checkedAttribute}> `;
  return checkbox;
};

const markTask = (state: StateCore, index: number): void => {
  const inline = state.tokens[index];
  const firstChild = inline.children?.[0];
  const marker = firstChild?.type === "text" ? TASK_MARKER.exec(firstChild.content) : null;
  if (!firstChild || !marker) return;
  firstChild.content = firstChild.content.slice(marker[0].length);
  inline.children?.unshift(createCheckbox(state, marker[1] !== " "));
  state.tokens[index - 2].attrJoin("class", "gdy-md-task-item");
};

export const markTaskListItems = (state: StateCore): void => {
  state.tokens.forEach((_, index) => {
    if (isListItemParagraph(state.tokens, index)) markTask(state, index);
  });
};
