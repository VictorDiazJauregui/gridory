#!/usr/bin/env node
/**
 * Style contract audit (part 1): fails when
 *  - a legacy prefix (rdt-, rkb-, lui-) or the former product name shows up in
 *    the sources, the built package or the guides;
 *  - a literal color is written outside src/styles/tokens.css;
 *  - a component token (--gdy-<component>-*) is consumed without a fallback;
 *  - a Tailwind leftover survives: `--tw-`, `@tailwind`, `@config` or `@apply`
 *    in a library stylesheet, `--tw-` in dist/gridory.css, or tailwind-merge,
 *    clsx, class-variance-authority or tailwindcss in the built JS or in
 *    the runtime dependencies (the library ships plain gdy-* CSS).
 *
 * Run through `npm run audit:styles` after `npm run build`.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const failures = [];

const walk = (dir, accept) => {
  const out = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === "node_modules" || entry === "releases") continue;
      out.push(...walk(full, accept));
    } else if (accept(full)) {
      out.push(full);
    }
  }
  return out;
};

const rel = (file) => path.relative(root, file);
const hasExt = (...exts) => (file) => exts.includes(path.extname(file));

// 1. Legacy names --------------------------------------------------------------
const LEGACY = /\b(?:rdt|rkb|lui)-|lumini/i;
const legacyFiles = [
  ...walk(path.join(root, "src"), hasExt(".ts", ".tsx", ".css", ".md")),
  ...walk(path.join(root, "dist"), hasExt(".js", ".css", ".d.ts")),
  ...walk(path.join(root, "docs"), hasExt(".md")),
  path.join(root, "README.md"),
  path.join(root, "tailwind-preset.js"),
].filter(existsSync);

for (const file of legacyFiles) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, index) => {
    const match = line.match(LEGACY);
    if (match) failures.push(`${rel(file)}:${index + 1}: legacy name "${match[0]}"`);
  });
}

// 2. Literal colors only in tokens.css ------------------------------------------
const libraryCss = [
  ...walk(path.join(root, "src/styles"), hasExt(".css")),
  ...walk(path.join(root, "src/components"), hasExt(".css")),
];
const LITERAL_COLOR = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb)\(/i;

for (const file of libraryCss) {
  if (path.basename(file) === "tokens.css") continue;
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      const match = line.match(LITERAL_COLOR);
      if (match) failures.push(`${rel(file)}:${index + 1}: literal color "${match[0]}" (declare a token instead)`);
    });
}

// 3. Component tokens always carry a fallback ----------------------------------
const tokensSource = readFileSync(path.join(root, "src/styles/tokens.css"), "utf8");
const baseTokens = new Set(
  [...tokensSource.matchAll(/^\s*(--gdy-[a-z0-9-]+)\s*:/gm)].map((match) => match[1]),
);
const consumers = [
  ...libraryCss,
  ...walk(path.join(root, "src/components"), hasExt(".ts", ".tsx")),
];
const VAR_USE = /var\(\s*(--gdy-[a-z0-9-]+)\s*([,)])/g;

for (const file of consumers) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      for (const match of line.matchAll(VAR_USE)) {
        const [, name, next] = match;
        if (next === ")" && !baseTokens.has(name)) {
          failures.push(`${rel(file)}:${index + 1}: ${name} is a component token and needs a fallback`);
        }
      }
    });
}

// 4. No Tailwind leftovers ---------------------------------------------------------
const TAILWIND_CSS = /--tw-|@tailwind\b|@config\b|@apply\b/;
for (const file of libraryCss) {
  readFileSync(file, "utf8")
    .split("\n")
    .forEach((line, index) => {
      const match = line.match(TAILWIND_CSS);
      if (match) failures.push(`${rel(file)}:${index + 1}: Tailwind leftover "${match[0]}"`);
    });
}
const distCss = path.join(root, "dist/gridory.css");
if (existsSync(distCss)) {
  const count = (readFileSync(distCss, "utf8").match(/--tw-/g) ?? []).length;
  if (count > 0) failures.push(`dist/gridory.css: ${count} occurrence(s) of --tw- (Tailwind base layer leaked into the build)`);
}
const TAILWIND_PACKAGES = ["tailwind-merge", "clsx", "class-variance-authority", "tailwindcss"];
const TAILWIND_IMPORT = new RegExp(`["'](?:${TAILWIND_PACKAGES.join("|")})(?:/[^"']*)?["']`);
for (const file of walk(path.join(root, "dist"), hasExt(".js"))) {
  const match = readFileSync(file, "utf8").match(TAILWIND_IMPORT);
  if (match) failures.push(`${rel(file)}: imports ${match[0]}`);
}
const manifest = JSON.parse(readFileSync(path.join(root, "package.json"), "utf8"));
for (const name of TAILWIND_PACKAGES) {
  if (manifest.dependencies?.[name]) failures.push(`package.json: "${name}" is still a runtime dependency`);
}

// Report -----------------------------------------------------------------------
if (failures.length > 0) {
  console.error(`audit-legacy: ${failures.length} problem(s)\n` + failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log(
  `audit-legacy: OK (${legacyFiles.length} files free of legacy names, ${libraryCss.length} stylesheets without literal colors or Tailwind leftovers, ${baseTokens.size} base tokens, dist free of --tw- and Tailwind packages)`,
);
