#!/usr/bin/env node
/**
 * The CSS ships through the JS entries and gridory/styles.css, so the CSS imports tsc copies into dist/types
 * point to missing files and break consumers that compile with skipLibCheck off. Runs right after build:types.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DECLARATIONS_DIR = path.join(process.cwd(), "dist", "types");
const CSS_IMPORT_LINE = /^import\s+(["'])[^"'\n]+\.css\1;?[ \t]*(?:\r?\n|$)/gm;
// Broader than CSS_IMPORT_LINE on purpose: any import or re-export of a .css
// file, wherever it sits, means a declaration still points to a missing file.
const ANY_CSS_SPECIFIER = /(?:\bimport\s*|\bfrom\s*)(["'])[^"'\n]+\.css\1/;

export class CssImportLeftError extends Error {
  constructor(files) {
    super(`CSS imports left in the published declarations:\n${files.join("\n")}`);
    this.name = "CssImportLeftError";
  }
}

export const stripCssImports = (source) => source.replace(CSS_IMPORT_LINE, "");

export const hasCssImport = (source) => ANY_CSS_SPECIFIER.test(source);

const listDeclarationFiles = (dir) =>
  readdirSync(dir, { recursive: true })
    .filter((file) => file.endsWith(".d.ts"))
    .map((file) => path.join(dir, file));

const stripFile = (file) => {
  const source = readFileSync(file, "utf8");
  const stripped = stripCssImports(source);
  if (stripped === source) return false;
  writeFileSync(file, stripped);
  return true;
};

const assertNoCssImports = (files) => {
  const leftovers = files.filter((file) => hasCssImport(readFileSync(file, "utf8")));
  if (leftovers.length > 0) throw new CssImportLeftError(leftovers);
};

const main = () => {
  const files = listDeclarationFiles(DECLARATIONS_DIR);
  const strippedCount = files.filter(stripFile).length;
  assertNoCssImports(files);
  console.log(`strip-declaration-css-imports: OK (${strippedCount} of ${files.length} declarations cleaned)`);
};

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
