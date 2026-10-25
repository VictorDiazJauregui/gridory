import type { MarkdownCommand } from "./command-types";
import { insertBlock } from "./insert-block";

const TEMPLATE_FORMULA = "E = mc^2";
const FORMULA_TEMPLATE = `$$\n${TEMPLATE_FORMULA}\n$$`;
const TEMPLATE_FORMULA_START = 3;

/** Wraps the selection as an inline formula, or opens a display formula from a template. */
export const insertFormula: MarkdownCommand = (snapshot) => {
  const { text, selection } = snapshot;
  const selected = text.slice(selection.from, selection.to);
  if (selected.length === 0) return insertBlock({ text: FORMULA_TEMPLATE, cursor: TEMPLATE_FORMULA_START, selectLength: TEMPLATE_FORMULA.length })(snapshot);
  return {
    changes: [{ from: selection.from, to: selection.to, insert: `$${selected}$` }],
    selection: { from: selection.from + 1, to: selection.to + 1 },
  };
};
