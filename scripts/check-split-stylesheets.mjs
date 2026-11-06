#!/usr/bin/env node
/**
 * Proves that base.css and the module sheets, joined in SPLIT_STYLESHEETS order, are dist/gridory.css byte for byte:
 * the same rules in the same order, so they cascade like styles.css and every audit of gridory.css covers them too.
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SPLIT_STYLESHEETS } from "./split-stylesheets.mjs";

const DIST_DIR = path.join(process.cwd(), "dist");
// Vite appends this marker to a CSS bundle after minifying it; it holds no rule.
const VITE_HASH_MARKER = /\/\*\$vite\$:\d+\*\/\s*$/;
const CONTEXT_LENGTH = 80;

export class SplitStylesheetsError extends Error {
  constructor(message) {
    super(`check-split-stylesheets: ${message}`);
    this.name = "SplitStylesheetsError";
  }
}

export const stripViteMarker = (bundle) => bundle.replace(VITE_HASH_MARKER, "").trimEnd();

export const joinSplitStylesheets = (sheets) => sheets.map((sheet) => sheet.trimEnd()).join("");

export const findFirstDifference = (expected, actual) => {
  const length = Math.max(expected.length, actual.length);
  for (let index = 0; index < length; index += 1) {
    if (expected[index] !== actual[index]) return index;
  }
  return -1;
};

const readDistFile = (fileName) => {
  const file = path.join(DIST_DIR, fileName);
  if (!existsSync(file)) throw new SplitStylesheetsError(`dist/${fileName} not found, run \`npm run build\` first`);
  return readFileSync(file, "utf8");
};

const describeDifference = (bundle, joined, index) =>
  [
    `the joined sheets stop matching dist/gridory.css at character ${index}`,
    `  gridory.css: ${bundle.slice(index, index + CONTEXT_LENGTH)}`,
    `  joined:      ${joined.slice(index, index + CONTEXT_LENGTH)}`,
    "  (is a module missing from MODULE_NAMES in scripts/split-stylesheets.mjs, or out of order?)",
  ].join("\n");

const main = () => {
  const bundle = stripViteMarker(readDistFile("gridory.css"));
  const joined = joinSplitStylesheets(SPLIT_STYLESHEETS.map(({ fileName }) => readDistFile(fileName)));
  const index = findFirstDifference(bundle, joined);
  if (index >= 0) throw new SplitStylesheetsError(describeDifference(bundle, joined, index));
  console.log(`check-split-stylesheets: OK (${SPLIT_STYLESHEETS.length} sheets rebuild dist/gridory.css byte for byte)`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
