#!/usr/bin/env node
/**
 * Style contract audit (part 2): keeps the class hooks and the stylesheet in sync.
 *  - every gdy-* class and is-* state class written by the library has a rule
 *    in dist/gridory.css;
 *  - every .gdy-* / .is-* rule in dist/gridory.css is emitted by the library or
 *    listed as a public utility in scripts/audit-allowlist.json;
 *  - every [data-*] attribute selector in the library stylesheets is emitted by
 *    the library, set by Radix at runtime or set by the host app (both listed in
 *    the allowlist);
 *  - the demo mocks only use classes that exist.
 *
 * Needs dist/gridory.css, so run it after `npm run build`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const distCss = path.join(root, "dist/gridory.css");
if (!existsSync(distCss)) {
  console.error("audit-classes: dist/gridory.css not found, run `npm run build` first");
  process.exit(1);
}

const allowlist = JSON.parse(
  readFileSync(path.join(root, "scripts/audit-allowlist.json"), "utf8"),
);
const failures = [];

const walk = (dir, accept) => {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full, accept));
    else if (accept(full)) out.push(full);
  }
  return out;
};
const isSource = (file) => /\.(ts|tsx)$/.test(file);
const isStylesheet = (file) => file.endsWith(".css");
const stripComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const librarySources = walk(path.join(root, "src/components"), isSource).filter(
  (file) => !file.includes(`${path.sep}mocks${path.sep}`),
);
const mockSources = walk(path.join(root, "src/components/mocks"), isSource);
const libraryStylesheets = [
  ...walk(path.join(root, "src/styles"), isStylesheet),
  ...walk(path.join(root, "src/components"), isStylesheet),
];

// A class name is never preceded by a word char or a hyphen (that would be a
// `--gdy-*` custom property, written as var(--gdy-x) or as an inline style key).
const CLASS_IN_SOURCE = /(?<![\w-])(gdy-[a-z0-9]+(?:-[a-z0-9]+)*|is-[a-z]+(?:-[a-z]+)*)\b/g;
const CLASS_IN_CSS = /\.(gdy-[a-z0-9]+(?:-[a-z0-9]+)*|is-[a-z]+(?:-[a-z]+)*)(?![a-z0-9-])/g;
const ATTR_IN_CSS = /\[(data-[a-z0-9-]+)(?:\s*=\s*"?([^"\]]+)"?)?\]/g;

const collect = (files, regex) => {
  const found = new Map();
  for (const file of files) {
    const text = stripComments(readFileSync(file, "utf8"));
    for (const match of text.matchAll(regex)) {
      const name = match[1];
      if (!found.has(name)) found.set(name, new Set());
      found.get(name).add(path.relative(root, file));
    }
  }
  return found;
};

const usedByLibrary = collect(librarySources, CLASS_IN_SOURCE);
const usedByMocks = collect(mockSources, CLASS_IN_SOURCE);
const definedInDist = collect([distCss], CLASS_IN_CSS);
const publicUtilities = new Set(allowlist.publicUtilities);
const externalAttributes = new Set([
  ...allowlist.runtimeAttributes,
  ...allowlist.hostAttributes,
]);

// 1. Every class the library writes has a rule -------------------------------
for (const [name, files] of usedByLibrary) {
  if (!definedInDist.has(name)) {
    failures.push(`class "${name}" is used in ${[...files].join(", ")} but has no rule in dist/gridory.css`);
  }
}

// 2. Every rule is used (or is a documented public utility) ---------------------
for (const name of definedInDist.keys()) {
  if (usedByLibrary.has(name) || publicUtilities.has(name)) continue;
  failures.push(`rule ".${name}" in dist/gridory.css is not emitted by any component (add it to publicUtilities if it is meant for consumers)`);
}

// 3. Public utilities really exist ---------------------------------------------
for (const name of publicUtilities) {
  if (!definedInDist.has(name)) failures.push(`public utility "${name}" from the allowlist has no rule in dist/gridory.css`);
}

// 4. Attribute selectors resolve to something the library or Radix emits --------
const librarySourceText = librarySources
  .map((file) => stripComments(readFileSync(file, "utf8")))
  .join("\n");
for (const file of libraryStylesheets) {
  const text = stripComments(readFileSync(file, "utf8"));
  for (const match of text.matchAll(ATTR_IN_CSS)) {
    const [, attribute, value] = match;
    if (externalAttributes.has(attribute)) continue;
    const needle = value ? `${attribute}="${value}"` : attribute;
    if (!librarySourceText.includes(needle)) {
      failures.push(`${path.relative(root, file)}: selector [${attribute}${value ? `="${value}"` : ""}] is never emitted by a component`);
    }
  }
}

// 5. Mocks only use existing classes --------------------------------------------
for (const [name, files] of usedByMocks) {
  if (!definedInDist.has(name)) failures.push(`mock class "${name}" in ${[...files].join(", ")} has no rule in dist/gridory.css`);
}

if (failures.length > 0) {
  console.error(`audit-classes: ${failures.length} problem(s)\n` + failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log(
  `audit-classes: OK (${usedByLibrary.size} classes emitted by the library, ${definedInDist.size} rules in dist/gridory.css, ${publicUtilities.size} public utilities)`,
);
