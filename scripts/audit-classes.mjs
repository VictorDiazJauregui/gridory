#!/usr/bin/env node
/**
 * Style contract audit (part 2): keeps the class hooks, the state attributes
 * and the stylesheet in sync.
 *  - every gdy-* class written by the library has a rule in dist/gridory.css
 *    or is a declared hook-only class (scripts/audit-allowlist.json →
 *    hookOnly: structural hooks shipped without default declarations);
 *  - every .gdy-* rule in dist/gridory.css is emitted by the library or listed
 *    as a public utility in the allowlist;
 *  - every hook-only class is really emitted and really has no rule;
 *  - no is-* state class survives in the library or in dist (states are
 *    data-* attributes or ARIA attributes);
 *  - every [data-*] / [aria-*] attribute selector in the library stylesheets
 *    is emitted by the library, set by Radix or react-day-picker at runtime or
 *    set by the host app (the last two listed in the allowlist); variant
 *    attributes (data-variant, data-size) take their value from a prop, so the
 *    value is checked as a string literal instead;
 *  - in every module (each directory of src/components except mocks) every
 *    class literal (className="…", strings inside className={cn(…)}, values of
 *    a classNames map) is a gdy-* hook, and no rdp-* name survives in those
 *    sources nor as a rule in dist (react-day-picker defaults are not merged
 *    in);
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
const CLASS_IN_SOURCE = /(?<![\w-])(gdy-[a-z0-9]+(?:-[a-z0-9]+)*)\b/g;
const STATE_CLASS_IN_SOURCE = /(?<![\w-])(is-[a-z]+(?:-[a-z]+)*)\b/g;
const CLASS_IN_CSS = /\.(gdy-[a-z0-9]+(?:-[a-z0-9]+)*)(?![a-z0-9-])/g;
const STATE_CLASS_IN_CSS = /\.(is-[a-z]+(?:-[a-z]+)*)(?![a-z0-9-])/g;
const ATTR_IN_CSS = /\[((?:data|aria)-[a-z0-9-]+)(?:\s*=\s*"?([^"\]]+)"?)?\]/g;

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
const hookOnly = new Set(allowlist.hookOnly);
const variantAttributes = new Set(allowlist.variantAttributes);
// Every module is strict: no utility class may reach the DOM from the library.
const strictModules = readdirSync(path.join(root, "src/components"))
  .filter((entry) => entry !== "mocks" && statSync(path.join(root, "src/components", entry)).isDirectory())
  .sort();
const externalAttributes = new Set([
  ...allowlist.runtimeAttributes,
  ...allowlist.hostAttributes,
]);

// 0. State classes are retired: states are data-* / ARIA attributes ----------
for (const [name, files] of collect(librarySources, STATE_CLASS_IN_SOURCE)) {
  failures.push(`state class "${name}" in ${[...files].join(", ")}: use a data-* or ARIA attribute instead`);
}
for (const name of collect([distCss], STATE_CLASS_IN_CSS).keys()) {
  failures.push(`rule ".${name}" in dist/gridory.css: state classes were replaced by attribute selectors`);
}

// 1. Every class the library writes has a rule (or is a declared hook) --------
for (const [name, files] of usedByLibrary) {
  if (definedInDist.has(name) || hookOnly.has(name)) continue;
  failures.push(`class "${name}" is used in ${[...files].join(", ")} but has no rule in dist/gridory.css (give it a rule or list it in hookOnly)`);
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

// 4. Hook-only classes are emitted and stay rule-less ---------------------------
for (const name of hookOnly) {
  if (!usedByLibrary.has(name)) failures.push(`hook-only class "${name}" from the allowlist is not emitted by any component`);
  if (definedInDist.has(name)) failures.push(`hook-only class "${name}" now has a rule in dist/gridory.css; remove it from hookOnly`);
}

// 5. Attribute selectors resolve to something the library or Radix emits --------
// data-* values are written literally in the components (data-slot="x"); aria-*
// values come from booleans (aria-pressed={active}), so only the name is checked.
const librarySourceText = librarySources
  .map((file) => stripComments(readFileSync(file, "utf8")))
  .join("\n");
for (const file of libraryStylesheets) {
  const text = stripComments(readFileSync(file, "utf8"));
  for (const match of text.matchAll(ATTR_IN_CSS)) {
    const [, attribute, value] = match;
    if (externalAttributes.has(attribute)) continue;
    if (variantAttributes.has(attribute)) {
      if (!librarySourceText.includes(attribute)) {
        failures.push(`${path.relative(root, file)}: selector [${attribute}] is never emitted by a component`);
      } else if (value && !librarySourceText.includes(`"${value}"`)) {
        failures.push(`${path.relative(root, file)}: no component uses the value "${value}" of ${attribute}`);
      }
      continue;
    }
    const needle = value && attribute.startsWith("data-") ? `${attribute}="${value}"` : attribute;
    if (!librarySourceText.includes(needle)) {
      failures.push(`${path.relative(root, file)}: selector [${attribute}${value ? `="${value}"` : ""}] is never emitted by a component`);
    }
  }
}

// 6. Strict modules: every class literal is a gdy-* hook, no rdp-* survives ----
// Sources of class literals: className="…", the string arguments of
// className={cn(…)}, and the values of a classNames map (inline or a const).
const CLASS_LITERAL_CONTEXTS = [
  /className=\{?"([^"]*)"/g,
  /className=\{cn\(([\s\S]*?)\)\}/g,
  /classNames=\{\{([\s\S]*?)\}\}/g,
  /const \w+_CLASS_NAMES[^{]*=\s*\{([\s\S]*?)\};/g,
];
const GDY_TOKEN = /^gdy-[a-z0-9]+(?:-[a-z0-9]+)*$/;
for (const moduleName of strictModules) {
  const dir = path.join(root, "src/components", moduleName);
  for (const file of walk(dir, isSource)) {
    const text = stripComments(readFileSync(file, "utf8"));
    const relative = path.relative(root, file);
    if (text.includes("rdp-")) failures.push(`strict module "${moduleName}": ${relative} mentions an rdp-* class`);
    for (const context of CLASS_LITERAL_CONTEXTS) {
      for (const match of text.matchAll(context)) {
        const literals = context === CLASS_LITERAL_CONTEXTS[0] ? [match[1]] : [...match[1].matchAll(/"([^"]*)"/g)].map((m) => m[1]);
        for (const literal of literals) {
          for (const token of literal.split(/\s+/).filter(Boolean)) {
            if (!GDY_TOKEN.test(token)) failures.push(`strict module "${moduleName}": class "${token}" in ${relative} is not a gdy-* hook`);
          }
        }
      }
    }
  }
}
if (/\.rdp-/.test(readFileSync(distCss, "utf8"))) failures.push("dist/gridory.css still contains an .rdp-* rule");

// 7. Mocks only use existing classes --------------------------------------------
for (const [name, files] of usedByMocks) {
  if (!definedInDist.has(name)) failures.push(`mock class "${name}" in ${[...files].join(", ")} has no rule in dist/gridory.css`);
}

if (failures.length > 0) {
  console.error(`audit-classes: ${failures.length} problem(s)\n` + failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log(
  `audit-classes: OK (${usedByLibrary.size} classes emitted by the library, ${definedInDist.size} rules in dist/gridory.css, ${publicUtilities.size} public utilities, ${hookOnly.size} hook-only classes, strict modules: ${strictModules.join(", ")})`,
);
