/**
 * Specificity of the stylesheet rules, for the catalog (npm run docs:hooks). Most rules
 * are a single class (0-1-0); the catalog lists the ones that are not, so consumers know
 * which selector to write when they override a module.
 */
const ZERO = [0, 0, 0];
const ID = /#[\w-]+/g;
const CLASS_OR_ATTRIBUTE = /\.[\w-]+|\[[^\]]+\]/g;
const PSEUDO_ELEMENT = /::[\w-]+/g;
const PSEUDO_CLASS = /:[\w-]+/g;
const TYPE = /(?:^|[\s>+~])([a-z][\w-]*)/gi;
const FUNCTIONAL_PSEUDO = /:(where|is|not|has)\(/;

const addSpecificity = (left, right) => left.map((value, index) => value + right[index]);

const compareSpecificity = (left, right) =>
  left[0] - right[0] || left[1] - right[1] || left[2] - right[2];

const closingParenthesis = (text, start) => {
  let depth = 1;
  let index = start;
  while (depth > 0 && index < text.length) {
    if (text[index] === "(") depth += 1;
    if (text[index] === ")") depth -= 1;
    index += 1;
  }
  return index - 1;
};

export const splitSelectorList = (list) => {
  const selectors = [];
  let depth = 0;
  let start = 0;
  [...list].forEach((character, index) => {
    if (character === "(") depth += 1;
    if (character === ")") depth -= 1;
    if (character !== "," || depth > 0) return;
    selectors.push(list.slice(start, index));
    start = index + 1;
  });
  return [...selectors, list.slice(start)].map((selector) => selector.trim()).filter(Boolean);
};

// :where() adds nothing; :is(), :not() and :has() add their most specific argument.
const extractFunctionalPseudo = (selector) => {
  const match = selector.match(FUNCTIONAL_PSEUDO);
  if (!match) return null;
  const argumentStart = match.index + match[0].length;
  const end = closingParenthesis(selector, argumentStart);
  const inner = splitSelectorList(selector.slice(argumentStart, end)).map(computeSpecificity);
  const weight = match[1] === "where" ? ZERO : inner.sort(compareSpecificity).at(-1) ?? ZERO;
  return { rest: selector.slice(0, match.index) + selector.slice(end + 1), weight };
};

const countSimpleSelectors = (selector) => {
  const withoutIds = selector.replace(ID, " ");
  const withoutClasses = withoutIds.replace(CLASS_OR_ATTRIBUTE, " ");
  const withoutElements = withoutClasses.replace(PSEUDO_ELEMENT, " ");
  const pseudoElements = (withoutClasses.match(PSEUDO_ELEMENT) ?? []).length;
  const types = [...withoutElements.replace(PSEUDO_CLASS, " ").matchAll(TYPE)].length;
  return [
    (selector.match(ID) ?? []).length,
    (withoutIds.match(CLASS_OR_ATTRIBUTE) ?? []).length + (withoutElements.match(PSEUDO_CLASS) ?? []).length,
    types + pseudoElements,
  ];
};

export const computeSpecificity = (selector) => {
  const functional = extractFunctionalPseudo(selector);
  if (!functional) return countSimpleSelectors(selector);
  return addSpecificity(functional.weight, computeSpecificity(functional.rest));
};

export const formatSpecificity = (specificity) => specificity.join("-");

const RULE_PRELUDE = /([^{}]+)\{/g;

// Keyframe steps and at-rules are not selectors; only rules that style a gdy-* hook count.
const isStyleRule = (prelude) => !prelude.startsWith("@") && !/^(?:from|to|\d)/.test(prelude);

export const readRuleSelectors = (css) =>
  [...css.matchAll(RULE_PRELUDE)]
    .map((match) => match[1].trim())
    .filter(isStyleRule)
    .flatMap(splitSelectorList)
    .filter((selector) => selector.includes(".gdy-"));

export const listCompoundRules = (css) => {
  const rules = new Map();
  for (const selector of readRuleSelectors(css)) {
    const specificity = formatSpecificity(computeSpecificity(selector));
    if (specificity !== "0-1-0") rules.set(selector, specificity);
  }
  return [...rules].map(([selector, specificity]) => ({ selector, specificity }));
};
