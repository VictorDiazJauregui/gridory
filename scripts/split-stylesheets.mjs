/**
 * The per-module stylesheets shipped next to gridory.css (see docs/theming.md › Per-module stylesheets).
 * vite.config.ts emits them and check-split-stylesheets.mjs proves that, joined in this order, they are gridory.css.
 */
export const BASE_STYLESHEET = { fileName: "base.css", source: "src/styles/index.css" };

// The order the modules take inside gridory.css: keeping it is what makes the split sheets cascade like the bundle.
// A new module goes here, at the place its rules take in gridory.css.
export const MODULE_NAMES = [
  "ai",
  "auth",
  "country-select",
  "table",
  "kanban",
  "segmented-control",
  "phone-input",
  "sidebar",
  "markdown-editor",
];

const toModuleStylesheet = (name) => ({ fileName: `${name}.css`, source: `src/components/${name}/styles.css` });

export const SPLIT_STYLESHEETS = [BASE_STYLESHEET, ...MODULE_NAMES.map(toModuleStylesheet)];

export class UnsupportedCssTargetError extends Error {
  constructor(target) {
    super(`split-stylesheets: build.cssTarget "${target}" is not a browser version lightningcss understands`);
    this.name = "UnsupportedCssTargetError";
  }
}

const LIGHTNINGCSS_BROWSERS = {
  chrome: "chrome",
  edge: "edge",
  firefox: "firefox",
  safari: "safari",
  ios: "ios_saf",
  opera: "opera",
};
const BROWSER_TARGET = /^([a-z]+)(\d+)(?:\.(\d+))?$/;

const toBrowserVersion = (target) => {
  const match = BROWSER_TARGET.exec(target);
  const browser = match && LIGHTNINGCSS_BROWSERS[match[1]];
  if (!browser) throw new UnsupportedCssTargetError(target);
  return [browser, (Number(match[2]) << 16) | (Number(match[3] ?? 0) << 8)];
};

// Vite minifies gridory.css with lightningcss for build.cssTarget; the split sheets need the very same targets
// to come out byte for byte like their part of the bundle.
export const toLightningcssTargets = (cssTarget) => {
  if (cssTarget === false) return undefined;
  return Object.fromEntries([cssTarget].flat().map(toBrowserVersion));
};
