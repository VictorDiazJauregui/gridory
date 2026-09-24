/**
 * Shared readers for the style scripts: which files make up the library, how
 * class names and tokens are recognized in sources and stylesheets, and the
 * allowlist of intentional exceptions (see docs/theming.md › Style audit).
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export const root = process.cwd();
export const distCss = path.join(root, "dist/gridory.css");

export const walk = (dir, accept) => {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full, accept));
    else if (accept(full)) out.push(full);
  }
  return out;
};
export const isSource = (file) => /\.(ts|tsx)$/.test(file);
export const isStylesheet = (file) => file.endsWith(".css");
export const stripComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
export const readStripped = (file) => stripComments(readFileSync(file, "utf8"));
export const relative = (file) => path.relative(root, file);

export const librarySources = walk(path.join(root, "src/components"), isSource).filter(
  (file) => !file.includes(`${path.sep}mocks${path.sep}`),
);
export const mockSources = walk(path.join(root, "src/components/mocks"), isSource);
export const libraryStylesheets = [
  ...walk(path.join(root, "src/styles"), isStylesheet),
  ...walk(path.join(root, "src/components"), isStylesheet),
];

// A class name is never preceded by a word char or a hyphen (that would be a
// `--gdy-*` custom property, written as var(--gdy-x) or as an inline style key).
export const CLASS_IN_SOURCE = /(?<![\w-])(gdy-[a-z0-9]+(?:-[a-z0-9]+)*)\b/g;
export const STATE_CLASS_IN_SOURCE = /(?<![\w-])(is-[a-z]+(?:-[a-z]+)*)\b/g;
export const CLASS_IN_CSS = /\.(gdy-[a-z0-9]+(?:-[a-z0-9]+)*)(?![a-z0-9-])/g;
export const STATE_CLASS_IN_CSS = /\.(is-[a-z]+(?:-[a-z]+)*)(?![a-z0-9-])/g;
export const ATTR_IN_CSS = /\[((?:data|aria)-[a-z0-9-]+)(?:\s*=\s*"?([^"\]]+)"?)?\]/g;
export const TOKEN_DECLARATION = /(--gdy-[a-z0-9-]+)\s*:\s*([^;]+);/g;

export const collect = (files, regex) => {
  const found = new Map();
  const record = (name, file) => {
    if (!found.has(name)) found.set(name, new Set());
    found.get(name).add(relative(file));
  };
  for (const file of files) {
    for (const match of readStripped(file).matchAll(regex)) record(match[1], file);
  }
  return found;
};

export const readAllowlist = () =>
  JSON.parse(readFileSync(path.join(root, "scripts/audit-allowlist.json"), "utf8"));
